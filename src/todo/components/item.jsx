import { memo, useState, useCallback, useEffect } from "react";
import classnames from "classnames";

import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM } from "../constants";

export const Item = memo(function Item({ todo, dispatch, index ,latestCompleted}) {
    
    const [isWritable, setIsWritable] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const { title, completed, id, createdAt, completedAt } = todo; //added createdAt, completedAt

    const toggleItem = useCallback(() => dispatch({ type: TOGGLE_ITEM, payload: { id } }), [dispatch, id]);
    const removeItem = useCallback(() => dispatch({ type: REMOVE_ITEM, payload: { id } }), [dispatch, id]);
    const updateItem = useCallback((id, title) => dispatch({ type: UPDATE_ITEM, payload: { id, title } }), [dispatch, id]);

    const handleDoubleClick = useCallback(() => {
        setIsWritable(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsWritable(false);
    }, []);

    const handleUpdate = useCallback(
        (title) => {
            if (title.length === 0)
                removeItem(id);
            else
                updateItem(id, title);

            setIsWritable(false);
        },
        [id, removeItem, updateItem]
    );

    //for the transition will update the flag isNew
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsNew(false);
        }, 15000);
        return () => clearTimeout(timeout);
    }, []); 


//for displaying the label color based on tick
    const getColor = (completed,index,completedAt) => {
        if (completed) {
            if (latestCompleted.includes(completedAt)) {
                const colorIndex = latestCompleted.indexOf(completedAt);
                if (colorIndex === 0) {
                    return "green"; // Latest completed task is green
                } else if (colorIndex === 1) {
                    return "magenta"; // Second last completed task is magenta
                } else if (colorIndex === 2) {
                    return "yellow"; // Third last completed task is yellow
                }
            }
            return "grey"; // Other completed tasks are grey
        }
        return "black"; // Incomplete tasks are black
    };

    //for newly added task the initial font will be red and will change the lable color based on tick later
    const colorStyle = isNew ? "red" : getColor(completed, index,completedAt);

    return (
        <li className={classnames({ completed: todo.completed })} data-testid="todo-item">
            <div className="view">
                {isWritable ? (
                    <Input onSubmit={handleUpdate} label="Edit Todo Input" defaultValue={title} onBlur={handleBlur} />
                ) : (
                    <>
                        <input className="toggle" type="checkbox" data-testid="todo-item-toggle" checked={completed} onChange={toggleItem} />
                        <label data-testid="todo-item-label" onDoubleClick={handleDoubleClick} style={{ color: colorStyle }}>
                            {title} <br/>
                            CreatedAt: {createdAt} <br/> {/* displaying the timestamp */}
                            {completed && <span>CompletedAt: {completedAt}</span>} {/* if the task is completed the timestamp will show*/}
                        </label>
                        <button className="destroy" data-testid="todo-item-button" onClick={removeItem} />
                    </>
                )}
            </div>
        </li>
    );
});
