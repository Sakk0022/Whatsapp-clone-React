# Whatsapp-clone-React
# Инструкция по запуску пользовательского интерфейса для отправки и получения сообщений WhatsApp

## Описание функционала
Приложение позволяет:
1. Пользователю войти в систему, введя свои учетные данные из GREEN-API (idInstance, apiTokenInstance).
2. Создать новый чат, указав номер телефона получателя.
3. Отправить текстовое сообщение через WhatsApp.
4. Получить ответ от собеседника и отобразить его в чате.

---

## Как запустить программу

### 1. Создание React-приложения
1. Откройте среду разработки (например, VS Code).
2. В терминале выполните команду для создания нового React-приложения:
   ```bash
   npx create-react-app my-app
   ```
3. Перейдите в созданную папку:
   ```bash
   cd my-app
   ```

### 2. Установка необходимых пакетов
1. Удалите предустановленные версии React и ReactDOM:
   ```bash
   npm uninstall react react-dom
   ```
2. Установите React версии 18 и ReactDOM версии 18:
   ```bash
   npm install react@18 react-dom@18
   ```
3. Установите дополнительные пакеты:
   ```bash
   npm install --no-audit --save @testing-library/jest-dom@^5.14.1 @testing-library/react@^13.0.0 @testing-library/user-event@^13.2.1 web-vitals@^2.1.0
   ```

### 3. Настройка проекта
1. В папке `src` добавьте мою  папку `styles` .
2. Замените содержимое файла `App.js` на мой файл App.js.
3. Сохраните все изменения.

### 4. Запуск приложения
1. Выполните команду:
   ```bash
   npm start
   ```
2. Приложение откроется в браузере по адресу [http://localhost:3000](http://localhost:3000).

---

## Примечания
- Перед использованием убедитесь, что у вас есть действительные учетные данные (idInstance и apiTokenInstance) из системы GREEN-API.
- Убедитесь, что указываете корректный номер телефона получателя для создания чата.
