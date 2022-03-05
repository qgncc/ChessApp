#ChessApp
ChessApp - многопользовательская игра в шахматы написанная на TS/HTML/SCSS 
с использованием шахматного движка [chessjs](https://github.com/jhlywa/chess.js)

Для того, чтобы сыграть один из пользователей создает комнату,
предварительно выбрав цвет за который он хочет играть
(либо позволяет веб-приложению выбрать сторону за него случайным образом), 
и получает ссылку на комнату, которую отправляет своему оппоненту.

Оппонент, переходя по ссылки, присоединяется к комнате и партия стартует автоматически.

## Модули

ChessApp - разделена на модули, каждый из которых выполняет свою задачу

### [ChessView](https://github.com/0xEVG/ChessApp/blob/main/src/ts/ChessView.ts)

Занмается отображением доски, передвижением фигур по ней и рендером окна 
превращения пешки

### [ChessGame](https://github.com/0xEVG/ChessApp/blob/main/src/ts/ChessGame.ts)
Модуль шахматной партии
+ с помощью модуля представления [ChessView](https://github.com/0xEVG/ChessApp/blob/main/src/ts/ChessView.ts)
осуществляет ее отображение.
+ с помощью шахматного движка [chessjs](https://github.com/jhlywa/chess.js),
контролирует легальность ходов.

### [Controller](https://github.com/0xEVG/ChessApp/blob/main/src/ts/Controller.ts)
Контролирует общение с сервером и user-flow

### [GameState](https://github.com/0xEVG/ChessApp/blob/main/src/ts/GameState.ts)
Создает объект хранящий в себе состояние игры и методы для работы с ним

### Компоненты фронтенда

+ [GameResultWindow](https://github.com/0xEVG/ChessApp/blob/main/src/ts/VictoryPrompt.ts)
 компонент окна результата партии
+ [StartForm](https://github.com/0xEVG/ChessApp/blob/main/src/ts/CreateForm.ts) компонент формы для создания комнаты
+ [WaitingScreen](https://github.com/0xEVG/ChessApp/blob/main/src/ts/WaitingScreen.ts) компонент страницы ожидания присоедениния игроков

### [Используемые типы](https://github.com/0xEVG/ChessApp/blob/main/src/ts/types.ts)
    