import { createTool } from "@mastra/core/tools";
import type { IMastraLogger } from "@mastra/core/logger";
import { z } from "zod";

// Типы для домашних заданий
interface HomeworkItem {
  id: string;
  subject: string;
  description: string;
  dueDate: string;
  createdBy: number;
  createdAt: string;
  group?: number; // 1 или 2, undefined означает для всех
}

// Временное хранилище (в реальном проекте используйте базу данных)
let homeworkStorage: HomeworkItem[] = [];

export const homeworkManagementTool = createTool({
  id: "homework-management-tool", 
  description: "Управление домашними заданиями: добавление, просмотр, редактирование и удаление ДЗ",
  inputSchema: z.object({
    action: z.enum(["add", "list", "delete", "edit", "get_by_subject"]).describe("Действие с домашними заданиями"),
    userId: z.number().describe("ID пользователя, выполняющего действие"),
    userRole: z.enum(["owner", "admin", "student", "unauthorized"]).describe("Роль пользователя"),
    
    // Параметры для добавления/редактирования ДЗ
    subject: z.string().optional().describe("Название предмета"),
    description: z.string().optional().describe("Описание домашнего задания"),
    dueDate: z.string().optional().describe("Срок сдачи (дата в формате YYYY-MM-DD)"),
    group: z.number().optional().describe("Группа для ДЗ (1 или 2), не указано = для всех групп"),
    
    // Параметры для удаления/редактирования
    homeworkId: z.string().optional().describe("ID домашнего задания для редактирования/удаления"),
    
    // Параметры для фильтрации
    filterGroup: z.number().optional().describe("Фильтровать ДЗ по группе"),
    showOnlyActive: z.boolean().default(true).describe("Показывать только активные ДЗ (не просроченные)")
  }),
  outputSchema: z.object({
    success: z.boolean().describe("Успешно ли выполнена операция"),
    message: z.string().describe("Сообщение о результате операции"),
    data: z.any().optional().describe("Данные результата (список ДЗ, информация о ДЗ и т.д.)"),
    error: z.string().optional().describe("Описание ошибки если произошла")
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    const { action, userId, userRole, subject, description, dueDate, group, homeworkId, filterGroup, showOnlyActive } = context;
    
    logger?.info('📚 [HomeworkManagement] Выполнение операции с ДЗ', { action, userId, userRole });

    try {
      // Проверка прав доступа
      if (userRole === "unauthorized") {
        return {
          success: false,
          message: "❌ Доступ запрещен. Вы не авторизованы в системе.",
          error: "Неавторизованный доступ"
        };
      }

      switch (action) {
        case "add":
          return await addHomework({ userId, userRole, subject, description, dueDate, group, logger });
        
        case "list":
          return await listHomework({ filterGroup, showOnlyActive, logger });
        
        case "delete":
          return await deleteHomework({ userId, userRole, homeworkId, logger });
        
        case "edit":
          return await editHomework({ userId, userRole, homeworkId, subject, description, dueDate, group, logger });
        
        case "get_by_subject":
          return await getHomeworkBySubject({ subject, filterGroup, logger });
        
        default:
          return {
            success: false,
            message: "❌ Неизвестное действие",
            error: "Неподдерживаемое действие"
          };
      }
    } catch (error) {
      logger?.error('❌ [HomeworkManagement] Ошибка выполнения операции', { 
        action, 
        userId, 
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        message: "❌ Произошла ошибка при выполнении операции",
        error: error instanceof Error ? error.message : "Неизвестная ошибка"
      };
    }
  },
});

// Функции для работы с домашними заданиями
async function addHomework(params: {
  userId: number;
  userRole: string;
  subject?: string;
  description?: string;
  dueDate?: string;
  group?: number;
  logger?: IMastraLogger;
}) {
  const { userId, userRole, subject, description, dueDate, group, logger } = params;
  
  // Только админы и владельцы могут добавлять ДЗ
  if (userRole !== "admin" && userRole !== "owner") {
    return {
      success: false,
      message: "❌ Недостаточно прав. Только староста и владельцы могут добавлять домашние задания.",
      error: "Недостаточно прав"
    };
  }

  if (!subject || !description || !dueDate) {
    return {
      success: false,
      message: "❌ Необходимо указать предмет, описание и срок сдачи",
      error: "Недостаточно данных"
    };
  }

  // Валидация даты
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dueDate)) {
    return {
      success: false,
      message: "❌ Неверный формат даты. Используйте формат YYYY-MM-DD (например: 2024-12-25)",
      error: "Неверный формат даты"
    };
  }

  const parsedDate = new Date(dueDate);
  if (isNaN(parsedDate.getTime())) {
    return {
      success: false,
      message: "❌ Некорректная дата",
      error: "Некорректная дата"
    };
  }

  const homeworkId = `hw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newHomework: HomeworkItem = {
    id: homeworkId,
    subject,
    description,
    dueDate,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    group
  };

  homeworkStorage.push(newHomework);
  
  logger?.info('✅ [HomeworkManagement] ДЗ добавлено', { homeworkId, subject, group });
  
  const groupText = group ? `для ${group}-й группы` : "для всех групп";
  return {
    success: true,
    message: `✅ Домашнее задание добавлено!\n\n📖 Предмет: ${subject}\n📝 Описание: ${description}\n📅 Срок сдачи: ${dueDate}\n👥 ${groupText}`,
    data: newHomework
  };
}

async function listHomework(params: {
  filterGroup?: number;
  showOnlyActive: boolean;
  logger?: IMastraLogger;
}) {
  const { filterGroup, showOnlyActive, logger } = params;
  
  let filteredHomework = [...homeworkStorage];
  
  // Фильтрация по группе
  if (filterGroup) {
    filteredHomework = filteredHomework.filter(hw => 
      hw.group === filterGroup || hw.group === undefined
    );
  }
  
  // Фильтрация по активности (не просроченные)
  if (showOnlyActive) {
    const now = new Date();
    filteredHomework = filteredHomework.filter(hw => 
      new Date(hw.dueDate) >= now
    );
  }
  
  logger?.info('📋 [HomeworkManagement] Получен список ДЗ', { 
    total: filteredHomework.length, 
    filterGroup, 
    showOnlyActive 
  });
  
  if (filteredHomework.length === 0) {
    return {
      success: true,
      message: "📋 Домашних заданий не найдено",
      data: []
    };
  }
  
  // Формируем текстовый список
  const homeworkList = filteredHomework
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .map((hw, index) => {
      const groupText = hw.group ? ` (${hw.group}-я группа)` : " (все группы)";
      const isOverdue = new Date(hw.dueDate) < new Date();
      const statusEmoji = isOverdue ? "⏰" : "📅";
      
      return `${index + 1}. ${statusEmoji} ${hw.subject}${groupText}\n` +
             `   📝 ${hw.description}\n` +
             `   📅 До: ${hw.dueDate}`;
    })
    .join('\n\n');
  
  return {
    success: true,
    message: `📚 Список домашних заданий:\n\n${homeworkList}`,
    data: filteredHomework
  };
}

async function deleteHomework(params: {
  userId: number;
  userRole: string;
  homeworkId?: string;
  logger?: IMastraLogger;
}) {
  const { userId, userRole, homeworkId, logger } = params;
  
  // Только админы и владельцы могут удалять ДЗ
  if (userRole !== "admin" && userRole !== "owner") {
    return {
      success: false,
      message: "❌ Недостаточно прав. Только староста и владельцы могут удалять домашние задания.",
      error: "Недостаточно прав"
    };
  }

  if (!homeworkId) {
    return {
      success: false,
      message: "❌ Необходимо указать ID домашнего задания",
      error: "Не указан ID"
    };
  }

  const index = homeworkStorage.findIndex(hw => hw.id === homeworkId);
  if (index === -1) {
    return {
      success: false,
      message: "❌ Домашнее задание не найдено",
      error: "ДЗ не найдено"
    };
  }

  const deletedHomework = homeworkStorage.splice(index, 1)[0];
  
  logger?.info('🗑️ [HomeworkManagement] ДЗ удалено', { homeworkId, subject: deletedHomework.subject });
  
  return {
    success: true,
    message: `✅ Домашнее задание удалено: ${deletedHomework.subject}`,
    data: deletedHomework
  };
}

async function editHomework(params: {
  userId: number;
  userRole: string;
  homeworkId?: string;
  subject?: string;
  description?: string;
  dueDate?: string;
  group?: number;
  logger?: IMastraLogger;
}) {
  const { userId, userRole, homeworkId, subject, description, dueDate, group, logger } = params;
  
  // Только админы и владельцы могут редактировать ДЗ
  if (userRole !== "admin" && userRole !== "owner") {
    return {
      success: false,
      message: "❌ Недостаточно прав. Только староста и владельцы могут редактировать домашние задания.",
      error: "Недостаточно прав"
    };
  }

  if (!homeworkId) {
    return {
      success: false,
      message: "❌ Необходимо указать ID домашнего задания",
      error: "Не указан ID"
    };
  }

  const homework = homeworkStorage.find(hw => hw.id === homeworkId);
  if (!homework) {
    return {
      success: false,
      message: "❌ Домашнее задание не найдено",
      error: "ДЗ не найдено"
    };
  }

  // Обновляем поля если они указаны
  if (subject) homework.subject = subject;
  if (description) homework.description = description;
  if (dueDate) homework.dueDate = dueDate;
  if (group !== undefined) homework.group = group;
  
  logger?.info('✏️ [HomeworkManagement] ДЗ отредактировано', { homeworkId, subject: homework.subject });
  
  const groupText = homework.group ? `для ${homework.group}-й группы` : "для всех групп";
  return {
    success: true,
    message: `✅ Домашнее задание обновлено!\n\n📖 Предмет: ${homework.subject}\n📝 Описание: ${homework.description}\n📅 Срок сдачи: ${homework.dueDate}\n👥 ${groupText}`,
    data: homework
  };
}

async function getHomeworkBySubject(params: {
  subject?: string;
  filterGroup?: number;
  logger?: IMastraLogger;
}) {
  const { subject, filterGroup, logger } = params;
  
  if (!subject) {
    return {
      success: false,
      message: "❌ Необходимо указать название предмета",
      error: "Не указан предмет"
    };
  }

  let filteredHomework = homeworkStorage.filter(hw => 
    hw.subject.toLowerCase().includes(subject.toLowerCase())
  );
  
  if (filterGroup) {
    filteredHomework = filteredHomework.filter(hw => 
      hw.group === filterGroup || hw.group === undefined
    );
  }
  
  logger?.info('🔍 [HomeworkManagement] Поиск ДЗ по предмету', { subject, found: filteredHomework.length });
  
  if (filteredHomework.length === 0) {
    return {
      success: true,
      message: `📋 Домашних заданий по предмету "${subject}" не найдено`,
      data: []
    };
  }
  
  const homeworkList = filteredHomework
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .map((hw, index) => {
      const groupText = hw.group ? ` (${hw.group}-я группа)` : " (все группы)";
      const isOverdue = new Date(hw.dueDate) < new Date();
      const statusEmoji = isOverdue ? "⏰" : "📅";
      
      return `${index + 1}. ${statusEmoji} ${hw.subject}${groupText}\n` +
             `   📝 ${hw.description}\n` +
             `   📅 До: ${hw.dueDate}`;
    })
    .join('\n\n');
  
  return {
    success: true,
    message: `📚 ДЗ по предмету "${subject}":\n\n${homeworkList}`,
    data: filteredHomework
  };
}