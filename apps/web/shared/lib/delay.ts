/**
 * Имитирует задержку сервера от 1 до 2 секунд
 */
export async function delay(): Promise<void> {
  const minDelay = 1000; // 1 секунда
  const maxDelay = 2000; // 2 секунды
  const randomDelay = Math.floor(
    Math.random() * (maxDelay - minDelay + 1) + minDelay
  );
  await new Promise((resolve) => setTimeout(resolve, randomDelay));
}
