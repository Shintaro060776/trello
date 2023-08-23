import React, { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import dummyData from "../dummyData";
import Card from './Card';

function Main() {

    const [data, setData] = useState(dummyData);

    const onDragEnd = (result) => {
        console.log(result);
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            //動かし始めたcolumnの配列の番号を取得()
            const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
            console.log(sourceColIndex);
            //動かし終わったcolumnの配列の番号を取得()
            const destinationColIndex = data.findIndex(
                (e) => e.id === destination.droppableId
            );
            console.log(destinationColIndex);

            const sourseCol = data[sourceColIndex];
            const destinationCol = data[destinationColIndex];

            //動かし始めたタスクに属していたカラムの中のタスクを全て取得
            //後でsplice関数でその動かし始めたタスクを削除するため
            //sourceTaskに配列をコピーしておく(破壊操作を後でするため)
            const sourceTask = [...sourseCol.tasks];
            console.log(sourceTask);

            //動かし終わったタスクに属していたカラムの中のタスクを全て取得
            //後でsplice関数でその動かし始めたタスクを追加するため
            const destinationTask = [...destinationCol.tasks];
            console.log(destinationTask);

            //前のカラムから削除
            const [removed] = sourceTask.splice(source.index, 1);
            //後のカラムに追加
            destinationTask.splice(destination.index, 0, removed);

            data[sourceColIndex].tasks = sourceTask;
            data[destinationColIndex].tasks = destinationTask;

            setData(data);
        } else {
            const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
            console.log(sourceColIndex);
            const sourceCol = data[sourceColIndex];
            console.log(sourceCol);

            const sourceTask = [...sourceCol.tasks];
            const [removed] = sourceTask.splice(source.index, 1);
            sourceTask.splice(destination.index, 0, removed);
            data[sourceColIndex].tasks = sourceTask;
            setData(data);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className='trello'>
                {data.map((section) => (
                    <Droppable key={section.id} droppableId={section.id}>
                        {(provided) => (
                            <div className='trello-section' ref={provided.innerRef} {...provided.droppableProps}>
                                <div className='trello-section-title'>
                                    {section.title}
                                </div>
                                <div className='trello-section-content'>
                                    {section.tasks.map((task, index) => (
                                        <Draggable draggableId={task.id} index={index} key={task.id}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        opacity: snapshot.isDragging ? "0.3" : "1",
                                                    }}
                                                >
                                                    <Card>{task.title}</Card>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    )
}

export default Main;