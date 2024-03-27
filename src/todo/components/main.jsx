import { useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";

import { Item } from "./item";
import classnames from "classnames";

import { TOGGLE_ALL } from "../constants";

export function Main({ todos, dispatch }) {
    const { pathname: route } = useLocation();

    const visibleTodos = useMemo(
        () =>
            todos.filter((todo) => {
                if (route === "/active")
                    return !todo.completed;

                if (route === "/completed")
                    return todo.completed;

                return todo;
            }),
        [todos, route]
    );
    const latestCompleted = useMemo(() => {
        const completedTimestamps = visibleTodos
            .filter(todo => todo.completed)
            .map(todo => todo.completedAt)
            .sort((a, b) => new Date(b) - new Date(a)); // Sort timestamps in descending order

        return completedTimestamps.slice(0, 3); // Get the latest three timestamps
    }, [visibleTodos]);

    const toggleAll = useCallback((e) => dispatch({ type: TOGGLE_ALL, payload: { completed: e.target.checked } }), [dispatch]);

    return (
        <main className="main" data-testid="main">
            {visibleTodos.length > 0 ? (
                <div className="toggle-all-container">
                    <input className="toggle-all" type="checkbox" data-testid="toggle-all" checked={visibleTodos.every((todo) => todo.completed)} onChange={toggleAll} />
                    <label className="toggle-all-label" htmlFor="toggle-all">
                        Toggle All Input
                    </label>
                </div>
            ) : null}
            <ul className={classnames("todo-list")} data-testid="todo-list">
                {visibleTodos.map((todo, index) => (
                    <Item todo={todo} dispatch={dispatch} index={index} latestCompleted={latestCompleted} createdAt={todo.createdAt} completedAt={todo.completedAt} /> /*passing the props createdAt, completedAt*/

                ))}
            </ul>
        </main>
    );
}
