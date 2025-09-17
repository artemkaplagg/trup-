import { createTool } from "@mastra/core/tools";
import type { IMastraLogger } from "@mastra/core/logger";
import { z } from "zod";

export const greetingComposerTool = createTool({
  id: "greeting-composer-tool",
  description: "Создает персонализированное приветствие для пользователя с информацией об ID, username и группе",
  inputSchema: z.object({
    userId: z.number().describe("Telegram ID пользователя"),
    username: z.string().optional().describe("Username пользователя в Telegram (может отсутствовать)"),
    firstName: z.string().optional().describe("Имя пользователя"),
    lastName: z.string().optional().describe("Фамилия пользователя"),
    role: z.enum(["owner", "admin", "student", "unauthorized"]).describe("Роль пользователя в системе"),
    group: z.number().nullable().describe("Номер группы пользователя (1 или 2), null если группа неизвестна"),
    groupName: z.string().describe("Название группы пользователя"),
    isAuthorized: z.boolean().describe("Авторизован ли пользователь")
  }),
  outputSchema: z.object({
    message: z.string().describe("Составленное приветственное сообщение"),
    messageType: z.enum(["authorized", "unauthorized"]).describe("Тип сообщения")
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    const { userId, username, firstName, lastName, role, group, groupName, isAuthorized } = context;
    
    logger?.info('💬 [GreetingComposer] Создание приветствия', { userId, role });

    if (!isAuthorized) {
      const unauthorizedMessage = `❌ Доступ запрещен!\n\n🆔 Ваш ID: ${userId}\n${username ? `👤 Username: @${username}\n` : ''}📝 Статус: Неавторизованный пользователь\n\n⚠️ Вы не являетесь учеником данного класса. Обратитесь к администратору для получения доступа.`;
      
      logger?.info('🚫 [GreetingComposer] Создано сообщение отказа в доступе', { userId });
      
      return {
        message: unauthorizedMessage,
        messageType: "unauthorized" as const
      };
    }

    // Формируем персонализированное приветствие
    let greeting = "👋 Привет";
    if (firstName) {
      greeting += `, ${firstName}`;
      if (lastName) {
        greeting += ` ${lastName}`;
      }
    }
    greeting += "!";

    // Определяем эмодзи роли
    let roleEmoji = "📚";
    let roleText = "Ученик";
    
    if (role === "owner") {
      roleEmoji = "👑";
      roleText = "Владелец (Программист)";
    } else if (role === "admin") {
      roleEmoji = "🎓";
      roleText = "Староста";
    }

    const message = `${greeting}\n\n` +
      `🆔 Ваш ID: ${userId}\n` +
      `${username ? `👤 Username: @${username}\n` : '👤 Username: не установлен\n'}` +
      `${roleEmoji} Роль: ${roleText}\n` +
      `👥 Группа: ${groupName}\n\n` +
      `✅ Добро пожаловать в систему управления классом!\n\n` +
      `${role === "owner" ? "👑 У вас полные права администратора системы.\n" : ""}` +
      `${role === "admin" ? "🎓 У вас права администратора для управления классом.\n" : ""}` +
      `📱 Используйте команды бота для взаимодействия с системой.`;

    logger?.info('✅ [GreetingComposer] Приветствие создано успешно', { userId });
    
    return {
      message,
      messageType: "authorized" as const
    };
  },
});