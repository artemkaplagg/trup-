import { createTool } from "@mastra/core/tools";
import type { IMastraLogger } from "@mastra/core/logger";
import { z } from "zod";

// ID учеников 1-й группы
const GROUP_1_IDS = [
  5566682926, 5241074325, 860000457, 6185367393, 8481372472,
  5029724753, 5650809687, 1942365829, 5552226319, 995840535,
  5760286438, 5379148476, 1236979350, 5339589336, 6558632830,
  1240354802
];

// ID учеников 2-й группы  
const GROUP_2_IDS = [
  5900078758, 1131216176, 5441600087, 5579250278, 1947836002,
  2018725205, 5530293880
];

export const groupDetectionTool = createTool({
  id: "group-detection-tool",
  description: "Определяет принадлежность пользователя к 1-й или 2-й группе класса по его Telegram ID",
  inputSchema: z.object({
    userId: z.number().describe("Telegram ID пользователя для определения группы"),
  }),
  outputSchema: z.object({
    group: z.number().nullable().describe("Номер группы пользователя (1 или 2), null если группа неизвестна"),
    groupName: z.string().describe("Название группы"),
    isGroupMember: z.boolean().describe("Является ли пользователь членом какой-либо группы"),
  }),
  execute: async ({ context: { userId }, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info('👥 [GroupDetection] Определение группы пользователя', { userId });

    let group: number | null;
    let groupName: string;
    let isGroupMember: boolean = true;

    if (GROUP_1_IDS.includes(userId)) {
      group = 1;
      groupName = "1-я группа";
      logger?.info('📝 [GroupDetection] Пользователь относится к 1-й группе', { userId });
    } else if (GROUP_2_IDS.includes(userId)) {
      group = 2;
      groupName = "2-я группа";
      logger?.info('📝 [GroupDetection] Пользователь относится к 2-й группе', { userId });
    } else {
      // Если пользователь не найден в группах, возвращаем null
      group = null;
      groupName = "Группа не определена";
      isGroupMember = false;
      logger?.warn('⚠️ [GroupDetection] Пользователь не найден в списках групп', { userId });
    }

    const result = {
      group,
      groupName,
      isGroupMember
    };

    logger?.info('✅ [GroupDetection] Группа определена', { userId, result });
    
    return result;
  },
});