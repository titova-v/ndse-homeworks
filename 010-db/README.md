# Домашнее задание к занятию «2.6. База данных и хранение данных»

**Правила выполнения домашней работы:** 
* выполняйте домашнее задание в отдельной ветке проекта на GitHub,
* в поле для сдачи работы прикрепите ссылку на ваш проект в Git,
* присылать на проверку можно каждую задачу по отдельности или все задачи вместе, 
* во время проверки по частям ваша домашняя работа будет обозначаться статусом «На доработке»,
* любые вопросы по решению задач задавайте в канале вашей группы.


#### Задание 1
Чтобы в будущем вам было легче работать с **MongoDB**, изучите раздел 
документации об использовании [**CRUD Operations**](https://docs.mongodb.com/manual/crud/).

#### Задание 2
В файле **README.md** написать следующие запросы для **MongoDB**:
 - запрос(ы) для *вставки* данных минимум о двух книгах в коллекцию **books**,
 - запрос для *поиска* полей документов коллекции **books** по полю *title*,
 - запрос для *редактирования* полей: *description* и *authors* коллекции **books** по *_id* записи.
 
*Каждый документ коллекции **books** должен содержать следующую структуру данных: 
```javascript
{
  title: "string",
  description: "string",
  authors: "string"
}
```

#### Решение

```
db.books.insertMany([
  { title: "Alice's adventures in Wonderland", description: "Story about a girl falling through a rabbit hole into a fantasy world populated by peculiar, anthropomorphic creatures", authors: "Lewis Carroll" },
  { title: "Harry Potter and the Philosopher's Stone", description: "Story about a boy who alived", authors: "Joanne Kathleen Rowling" }
])
```

```
const title = "Harry Potter and the Philosopher's Stone"
db.books.find({title})
```

```
const id = this.id
db.books.updateOne(
 {_id: id },
 { $set: { authors: "J.K. Rowling", description: "Its story follows Harry's first year at Hogwarts School of Witchcraft and Wizardry as he discovers that he is a famous wizard and begins his formal wizarding education" }}
)
```

