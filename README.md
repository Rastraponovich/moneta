# Finvam - Финансовый трекер

Монорепозиторий для управления личными финансами.

## Структура

- `apps/web` - Next.js фронтенд приложение с мок API
- `packages/ui` - Общие UI компоненты (заготовка)
- `packages/shared` - Общие типы (заготовка)

## Разработка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка
npm run build

# Линтинг
npm run lint

# Форматирование
npm run format

# Тесты
npm run test              # Запуск тестов
npm run test:watch        # Запуск тестов в watch режиме
npm run test:ui           # Запуск тестов с UI интерфейсом
npm run test:coverage    # Запуск тестов с генерацией coverage отчета
```

## API (Моки)

Все API endpoints находятся в `apps/web/app/api/`:

- `GET /api/transactions` - список транзакций
- `POST /api/transactions` - создание транзакции
- `GET /api/balance` - баланс
- `GET /api/categories` - категории
- `POST /api/auth/login` - вход
- `POST /api/auth/register` - регистрация
- `POST /api/auth/logout` - выход
- `GET /api/auth/me` - текущий пользователь

В будущем эти моки будут заменены на Go бэкенд.

## Технологии

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS v4
- **Архитектура**: Feature-Sliced Design (FSD)
- **Иконки**: Lucide React
- **Тестирование**: Vitest
- **Монорепо**: Turborepo
- **CI/CD**: GitHub Actions

## Коммиты

Проект использует Conventional Commits. Формат: `<type>(<scope>): <subject>`

Примеры:

- `feat(web): add transaction form`
- `fix(api): correct balance calculation`
- `docs: update README`
