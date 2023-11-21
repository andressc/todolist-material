import {v1} from "uuid"
import {Filter, TasksType, TodoType} from "../types"
import {
    addTodoListAC,
    changeFilterTodoListAC,
    changeTitleTodoListAC,
    removeTodoListAC,
    todolistReducer
} from "./todolist-reducer"
import {taskReducer} from "./task-reducer"

let state: TodoType[]
let state2: TasksType
const todoList1: string = v1()
const todoList2: string = v1()
const title: string = "newTodo"
const filter: Filter = "Active"

const task1: string = v1()
const task2: string = v1()

beforeEach(() => {
    state = [
        {
            id: todoList1,
            title: "todo 1",
            filter: "All",
        },
        {
            id: todoList2,
            title: "todo 2",
            filter: "All",
        }
    ]

    state2 = {
        [todoList1]: [
            {id: v1(), title: "1HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: task2, title: "ReactJS", isDone: false}
        ],
        [todoList2]: [
            {id: task1, title: "book", isDone: false},
            {id: v1(), title: "milk", isDone: true},
        ]
    }
})

test("remove TodoList", () => {
    const action = removeTodoListAC(todoList1)

    const result: TodoType[] = todolistReducer(state, action)
    const result2: TasksType = taskReducer(state2, action)

    expect(result.length).toBe(1)
    expect(result[0].id).toBe(todoList2)

    expect(result2[todoList1]).toBeUndefined()
})

test("add TodoList", () => {
    const action = addTodoListAC(title)

    const result: TodoType[] = todolistReducer(state, action)
    const result2: TasksType = taskReducer(state2, action)

    expect(result.length).toBe(3)
    expect(result[0].title).toBe(title)
    expect(result[0].filter).toBe("All")

    const keys = Object.keys(result2)
    const newKey = keys.find(k => k != todoList1 && k != todoList2)
    if(!newKey) throw Error("new key should be added")

    expect(keys.length).toBe(3)
    expect(result2[newKey]).toEqual([])

    expect(result[0].id).toBe(action.todoListId)
    expect(keys[2]).toBe(action.todoListId)
})

test("change Title TodoList", () => {
    const result: TodoType[] = todolistReducer(state, changeTitleTodoListAC(todoList2, title))

    expect(result.length).toBe(2)
    expect(result[1].title).toBe(title)
})

test("change Filter TodoList", () => {
    const result: TodoType[] = todolistReducer(state, changeFilterTodoListAC(todoList1, filter))

    expect(result.length).toBe(2)
    expect(result[0].filter).toBe(filter)
})

/*test("test WRONG ACTION", () => {
    expect(() => {
        todolistReducer(state, {type: "WRONG ACTION"})
    }).toThrow()
})*/
