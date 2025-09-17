import { createTool } from "@mastra/core/tools";
import type { IMastraLogger } from "@mastra/core/logger";
import { z } from "zod";

// Расписание звонков
const BELL_SCHEDULE = {
  1: { start: "08:30", end: "09:15" },
  2: { start: "09:25", end: "10:10" },
  3: { start: "10:20", end: "11:05" },
  4: { start: "11:35", end: "12:20" },
  5: { start: "12:30", end: "13:15" },
  6: { start: "13:25", end: "14:10" },
  7: { start: "14:20", end: "15:05" },
  8: { start: "15:15", end: "16:00" }
};

// Расписание уроков для групп
const SCHEDULE = {
  "Понедельник": {
    "group1": [
      { subject: "Мистецтво", room: "206", teacher: "Сорочан Н.Є." },
      { subject: "Биология", room: "569", teacher: "Лавок О.М." },
      { subject: "Здоровье", room: "248", teacher: "Марченко Ю.О." },
      { subject: "Всемирная история", room: "203", teacher: "Загребельна Л.П." },
      { subject: "Английский язык", room: "410", teacher: "Глибко С.І.", group_note: "1 группа" },
      { subject: "Украинский язык", room: "335", teacher: "Буяльська Н.І.", group_note: "2 группа" },
      { subject: "Информатика", room: "407", teacher: "Бабаєвський Олександр", group_note: "2 группа" }
    ],
    "group2": [
      { subject: "Мистецтво", room: "206", teacher: "Сорочан Н.Є." },
      { subject: "Биология", room: "569", teacher: "Лавок О.М." },
      { subject: "Здоровье", room: "248", teacher: "Марченко Ю.О." },
      { subject: "Всемирная история", room: "203", teacher: "Загребельна Л.П." },
      { subject: "Украинский язык", room: "335", teacher: "Буяльська Н.І.", group_note: "2 группа" },
      { subject: "Английский язык", room: "410", teacher: "Глибко С.І.", group_note: "1 группа" },
      { subject: "Информатика", room: "407", teacher: "Бабаєвський Олександр", group_note: "2 группа" }
    ]
  },
  "Вторник": {
    "group1": [
      { subject: "Биология", room: "569", teacher: "Лавок О.М." },
      { subject: "Математика", room: "200", teacher: "Майдан Віктор Іванівна" },
      { subject: "Финансовая грамотность", room: "242", teacher: "Приходько Л.І." },
      { subject: "Физическая культура", room: "610", teacher: "Ольховик Андрій Дмитрович" },
      { subject: "Физика", room: "145", teacher: "Салівон Н.Г." }
    ],
    "group2": [
      { subject: "Биология", room: "569", teacher: "Лавок О.М." },
      { subject: "Математика", room: "200", teacher: "Майдан Віктор Іванівна" },
      { subject: "Финансовая грамотность", room: "242", teacher: "Приходько Л.І." },
      { subject: "Физическая культура", room: "610", teacher: "Ольховик Андрій Дмитрович" },
      { subject: "Физика", room: "145", teacher: "Салівон Н.Г." }
    ]
  },
  "Среда": {
    "group1": [
      { subject: "Информатика", room: "407", teacher: "Бабаєвський Олександр", group_note: "1 группа" },
      { subject: "Английский язык", room: "410", teacher: "Глибко С.І.", group_note: "2 группа" },
      { subject: "Английский язык", room: "410", teacher: "Глибко С.І.", group_note: "1 группа" },
      { subject: "Украинский язык", room: "335", teacher: "Буяльська Н.І.", group_note: "2 группа" },
      { subject: "Физическая культура", room: "610", teacher: "Ольховик Андрій Дмитрович" },
      { subject: "Химия", room: "428", teacher: "Селезньова Ю.О." },
      { subject: "Технологии", room: "502", teacher: "Григорьева", group_note: "1 группа" }
    ],
    "group2": [
      { subject: "Английский язык", room: "410", teacher: "Глибко С.І.", group_note: "2 группа" },
      { subject: "Информатика", room: "407", teacher: "Бабаєвський Олександр", group_note: "1 группа" },
      { subject: "Украинский язык", room: "335", teacher: "Буяльська Н.І.", group_note: "2 группа" },
      { subject: "Английский язык", room: "410", teacher: "Глибко С.І.", group_note: "1 группа" },
      { subject: "Физическая культура", room: "610", teacher: "Ольховик Андрій Дмитрович" },
      { subject: "Химия", room: "428", teacher: "Селезньова Ю.О." },
      { subject: "Технологии", room: "502", teacher: "Григорьева", group_note: "1 группа" }
    ]
  },
  "Четверг": {
    "group1": [
      { subject: "История Украины", room: "203", teacher: "Загребельна Л.П." },
      { subject: "Украинский язык", room: "335", teacher: "Буяльська Н.І.", group_note: "1 группа" },
      { subject: "Технологии", room: "502", teacher: "Григорьева", group_note: "2 группа" },
      { subject: "Зарубежная литература", room: "242", teacher: "Приходько Л.І." },
      { subject: "Математика", room: "200", teacher: "Майдан Віктор Іванівна" },
      { subject: "Украинская литература", room: "335", teacher: "Буяльська Н.І." },
      { subject: "Физическая культура", room: "610", teacher: "Ольховик Андрій Дмитрович" }
    ],
    "group2": [
      { subject: "История Украины", room: "203", teacher: "Загребельна Л.П." },
      { subject: "Технологии", room: "502", teacher: "Григорьева", group_note: "2 группа" },
      { subject: "Украинский язык", room: "335", teacher: "Буяльська Н.І.", group_note: "1 группа" },
      { subject: "Зарубежная литература", room: "242", teacher: "Приходько Л.І." },
      { subject: "Математика", room: "200", teacher: "Майдан Віктор Іванівна" },
      { subject: "Украинская литература", room: "335", teacher: "Буяльська Н.І." },
      { subject: "Физическая культура", room: "610", teacher: "Ольховик Андрій Дмитрович" }
    ]
  },
  "Пятница": {
    "group1": [
      { subject: "STEM", room: "408", teacher: "Борецький К.П.", group_note: "1 группа" },
      { subject: "Украинский язык", room: "335", teacher: "Буяльська Н.І.", group_note: "2 группа" },
      { subject: "Английский язык", room: "410", teacher: "Глибко С.І." },
      { subject: "Математика", room: "200", teacher: "Майдан Віктор Іванівна" },
      { subject: "Украинская литература", room: "335", teacher: "Буяльська Н.І." },
      { subject: "География", room: "592", teacher: "Бабеща С.В." }
    ],
    "group2": [
      { subject: "Украинский язык", room: "335", teacher: "Буяльська Н.І.", group_note: "2 группа" },
      { subject: "STEM", room: "408", teacher: "Борецький К.П.", group_note: "1 группа" },
      { subject: "Английский язык", room: "410", teacher: "Глибко С.І." },
      { subject: "Математика", room: "200", teacher: "Майдан Віктор Іванівна" },
      { subject: "Украинская литература", room: "335", teacher: "Буяльська Н.І." },
      { subject: "География", room: "592", teacher: "Бабеща С.В." }
    ]
  }
};

export const currentLessonTool = createTool({
  id: "current-lesson-tool",
  description: "Определяет текущий урок и показывает расписание с цветовой индикацией: 🟩 - прошедшие уроки, 👈 - текущий урок, 🟦 - будущие уроки",
  inputSchema: z.object({
    userGroup: z.number().nullable().describe("Группа пользователя (1 или 2), null если не определена"),
    specificDay: z.string().optional().describe("Конкретный день недели (если не указан, используется текущий)")
  }),
  outputSchema: z.object({
    currentDay: z.string().describe("Текущий день недели"),
    currentTime: z.string().describe("Текущее время"),
    currentLesson: z.object({
      number: z.number().nullable().describe("Номер текущего урока"),
      subject: z.string().nullable().describe("Название текущего предмета"),
      timeRange: z.string().nullable().describe("Время текущего урока"),
      room: z.string().nullable().describe("Аудитория"),
      teacher: z.string().nullable().describe("Преподаватель")
    }).describe("Информация о текущем уроке"),
    schedule: z.array(z.object({
      number: z.number().describe("Номер урока"),
      subject: z.string().describe("Название предмета"),
      room: z.string().describe("Аудитория"),
      teacher: z.string().describe("Преподаватель"),
      timeRange: z.string().describe("Время урока"),
      status: z.enum(["past", "current", "future"]).describe("Статус урока"),
      emoji: z.string().describe("Эмодзи для статуса"),
      groupNote: z.string().optional().describe("Примечание о группе")
    })).describe("Расписание на день с цветовой индикацией"),
    message: z.string().describe("Форматированное сообщение с расписанием")
  }),
  execute: async ({ context: { userGroup, specificDay }, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info('🕐 [CurrentLesson] Определение текущего урока', { userGroup, specificDay });

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
    
    // Определяем день недели
    const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    let dayName: string;
    
    if (specificDay) {
      dayName = specificDay;
    } else {
      dayName = daysOfWeek[now.getDay()];
    }

    logger?.info('📅 [CurrentLesson] Обработка дня', { dayName, currentTime });

    // Проверяем, есть ли расписание на этот день
    if (!SCHEDULE[dayName as keyof typeof SCHEDULE]) {
      const message = `📅 ${dayName}\n🕐 Текущее время: ${currentTime}\n\n❌ На сегодня уроков нет или расписание не найдено`;
      
      return {
        currentDay: dayName,
        currentTime,
        currentLesson: {
          number: null,
          subject: null,
          timeRange: null,
          room: null,
          teacher: null
        },
        schedule: [],
        message
      };
    }

    // Получаем расписание для группы пользователя
    const groupKey = userGroup === 2 ? "group2" : "group1"; // По умолчанию 1 группа
    const daySchedule = SCHEDULE[dayName as keyof typeof SCHEDULE][groupKey];

    // Определяем текущий урок
    let currentLessonNumber: number | null = null;
    let currentLessonInfo = {
      number: null as number | null,
      subject: null as string | null,
      timeRange: null as string | null,
      room: null as string | null,
      teacher: null as string | null
    };

    for (const [lessonNum, bellTime] of Object.entries(BELL_SCHEDULE)) {
      const lessonNumber = parseInt(lessonNum);
      const { start, end } = bellTime;
      
      if (currentTime >= start && currentTime <= end) {
        currentLessonNumber = lessonNumber;
        const lessonData = daySchedule[lessonNumber - 1];
        if (lessonData) {
          currentLessonInfo = {
            number: lessonNumber,
            subject: lessonData.subject,
            timeRange: `${start} - ${end}`,
            room: lessonData.room,
            teacher: lessonData.teacher
          };
        }
        break;
      }
    }

    // Создаем расписание с цветовой индикацией
    const scheduleWithStatus = daySchedule.map((lesson, index) => {
      const lessonNumber = index + 1;
      const bellTime = BELL_SCHEDULE[lessonNumber as keyof typeof BELL_SCHEDULE];
      const timeRange = `${bellTime.start} - ${bellTime.end}`;
      
      // Определяем статус урока
      let status: "past" | "current" | "future";
      let emoji: string;
      
      if (lessonNumber === currentLessonNumber) {
        status = "current";
        emoji = "👈";
      } else if (currentTime > bellTime.end) {
        status = "past";
        emoji = "🟩";
      } else {
        status = "future";
        emoji = "🟦";
      }

      return {
        number: lessonNumber,
        subject: lesson.subject,
        room: lesson.room,
        teacher: lesson.teacher,
        timeRange,
        status,
        emoji,
        groupNote: (lesson as any).group_note
      };
    });

    // Формируем текстовое сообщение
    const groupText = userGroup ? `${userGroup}-я группа` : "1-я группа (по умолчанию)";
    let message = `📅 ${dayName} (${groupText})\n🕐 Текущее время: ${currentTime}\n\n`;
    
    if (currentLessonNumber) {
      message += `🔔 Сейчас идет ${currentLessonNumber} урок:\n`;
      message += `${currentLessonInfo.subject} (${currentLessonInfo.timeRange})\n`;
      message += `🏫 Кабинет: ${currentLessonInfo.room}\n`;
      message += `👨‍🏫 Учитель: ${currentLessonInfo.teacher}\n\n`;
    } else {
      message += `⏸️ Сейчас нет уроков\n\n`;
    }

    message += `📋 Расписание на день:\n\n`;
    
    scheduleWithStatus.forEach((lesson) => {
      const groupNoteText = lesson.groupNote ? ` (${lesson.groupNote})` : "";
      message += `${lesson.emoji} ${lesson.number}. ${lesson.subject}${groupNoteText}\n`;
      message += `   ⏰ ${lesson.timeRange}\n`;
      message += `   🏫 Кабинет: ${lesson.room}\n`;
      message += `   👨‍🏫 ${lesson.teacher}\n\n`;
    });

    message += `\n🟩 - прошедшие уроки\n👈 - текущий урок\n🟦 - будущие уроки`;

    logger?.info('✅ [CurrentLesson] Расписание сформировано', { 
      dayName, 
      currentLessonNumber, 
      totalLessons: scheduleWithStatus.length 
    });

    return {
      currentDay: dayName,
      currentTime,
      currentLesson: currentLessonInfo,
      schedule: scheduleWithStatus,
      message
    };
  },
});