import { createTool } from "@mastra/core/tools";
import type { IMastraLogger } from "@mastra/core/logger";
import { z } from "zod";

// Список всех авторизованных пользователей класса
const AUTHORIZED_USER_IDS = [
  // Владельцы (программисты)
  6185367393, // Первый программист
  1312687739, // Второй программист
  
  // Староста
  5552226319,
  
  // Ученики 1-й группы
  5566682926, 5241074325, 860000457, 8481372472, 5029724753,
  5650809687, 1942365829, 995840535, 5760286438, 5379148476,
  1236979350, 5339589336, 6558632830, 1240354802,
  
  // Ученики 2-й группы  
  5900078758, 1131216176, 5441600087, 5579250278, 1947836002,
  2018725205, 5530293880
];

// Роли пользователей
const USER_ROLES = {
  OWNER: [6185367393, 1312687739], // Владельцы (программисты)
  ADMIN: [5552226319], // Староста
  STUDENT: [] as number[] // Остальные - ученики
};

// Инициализируем список учеников
USER_ROLES.STUDENT = AUTHORIZED_USER_IDS.filter(
  id => !USER_ROLES.OWNER.includes(id) && !USER_ROLES.ADMIN.includes(id)
);

export const authorizationTool = createTool({
  id: "authorization-check-tool",
  description: "Проверяет авторизацию пользователя в системе класса по его Telegram ID",
  inputSchema: z.object({
    userId: z.number().describe("Telegram ID пользователя для проверки авторизации"),
  }),
  outputSchema: z.object({
    isAuthorized: z.boolean().describe("Авторизован ли пользователь"),
    role: z.enum(["owner", "admin", "student", "unauthorized"]).describe("Роль пользователя в системе"),
    message: z.string().describe("Сообщение о статусе авторизации"),
  }),
  execute: async ({ context: { userId }, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info('🔐 [Authorization] Проверка авторизации пользователя', { userId });

    // Проверяем авторизацию
    const isAuthorized = AUTHORIZED_USER_IDS.includes(userId);
    
    if (!isAuthorized) {
      logger?.warn('🚫 [Authorization] Неавторизованный доступ', { userId });
      return {
        isAuthorized: false,
        role: "unauthorized" as const,
        message: "❌ Доступ запрещен. Вы не являетесь учеником данного класса."
      };
    }

    // Определяем роль пользователя
    let role: "owner" | "admin" | "student";
    let message: string;

    if (USER_ROLES.OWNER.includes(userId)) {
      role = "owner";
      message = "👑 Добро пожаловать, владелец! У вас полные права администратора.";
    } else if (USER_ROLES.ADMIN.includes(userId)) {
      role = "admin";
      message = "🎓 Добро пожаловать, староста! У вас права администратора класса.";
    } else {
      role = "student";
      message = "📚 Добро пожаловать в систему класса!";
    }

    logger?.info('✅ [Authorization] Пользователь авторизован', { userId, role });
    
    return {
      isAuthorized: true,
      role,
      message
    };
  },
});