import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../lib/utils';
import { Grip, type LucideProps } from "lucide-react";

const DragHandle: React.FC<LucideProps> = (props) => (
    <Grip {...props} />
);

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    className?: string;
    handle?: boolean;
}

// id, className, children 
export const SortableItem: React.FC<SortableItemProps> = ({ id, children, className, handle = true }) => {
    /*
        setNodeRef: Dom 요소에 이 ref를 설정해야 dnd-kit가 요소를 추적, 조작 가능
        attributes: 드래그와 관련된 접근성 및 동작 속성을 포함한 객체
        
    */
    const {
        attributes,
        listeners,
        setNodeRef, // 전체를 연결
        setActivatorNodeRef, // 핸들만 연결
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? transition : undefined,
        zIndex: isDragging ? 10 : 0, // Bring dragged item to front
    };
    if (handle) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={cn(
                    "relative flex items-center gap-2 touch-action-none",
                    isDragging && "opacity-50",
                    className
                )}
            >
                <span
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...listeners}
                    className="cursor-grab select-none"
                >
                    <DragHandle className="w-4 h-4" />
                </span>
                <div className="flex-1">
                    {children}
                </div>
            </div>
        );
    } else {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className={cn(
                    "relative flex items-center gap-2 touch-action-none",
                    isDragging && "opacity-50",
                    className
                )}
            >
                <div className="flex-1">
                    {children}
                </div>
            </div>
        );

    }
};

interface SortableListProps<T extends { id: string }> {
    items: T[];
    onSortEnd: (oldIndex: number, newIndex: number) => void;
    renderItem: (item: T, index: number) => React.ReactNode;
    className?: string;
}

/**
 * SortableList 컴포넌트는 드래그 앤 드롭으로 정렬 가능한 리스트를 제공
 *
 * @template T - `id: string` 속성을 가진 제네릭 타입
 *
 * @param {T[]} items - 정렬 가능한 아이템 배열
 * @param {(oldIndex: number, newIndex: number) => void} onSortEnd - 드래그가 끝나고 순서가 바뀌었을 때 호출되는 콜백
 * @param {(item: T, index: number) => React.ReactNode} renderItem - 각 아이템을 렌더링하는 함수
 * @param {string} [className] - 리스트를 감싸는 div의 CSS 클래스 이름 (옵션)
 *
 * @returns {React.ReactElement} 정렬 가능한 리스트 컴포넌트
 *
 * @example
 * <SortableList
 *   items={myItems}
 *   onSortEnd={(oldIndex, newIndex) => handleReorder(oldIndex, newIndex)}
 *   renderItem={(item, index) => (
 *     <SortableItem key={item.id} id={item.id}>
 *       {item.label}
 *     </SortableItem>
 *   )}
 * />
 */
export function SortableList<T extends { id: string }>({
    items,
    onSortEnd,
    renderItem,
    className,
}: SortableListProps<T>) {

    // 마우스 입력 DnD 센서
    const sensors = useSensors(useSensor(PointerSensor));

    // 드래그가 끝났을 때 콜백 함수
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // 위치가 달라졌다면
        if (active.id !== over?.id) {
            //이동된 객체의 이전 index와 이후 index 찾고 반환
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over?.id);
            onSortEnd(oldIndex, newIndex);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                <div className={className}>
                    {items.map((item, index) => renderItem(item, index))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
