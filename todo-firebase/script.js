// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";

// Firebase設定ファイルからimport（機密情報は別ファイルで管理）
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// タスクデータストレージ
let todos = [];
let currentFilter = 'all';
let editingId = null;

// DOM要素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// Firebase Realtime Database参照
const todosRef = ref(database, 'todos');

// Firebaseからタスクを読み込む（リアルタイム同期）
function loadTodos() {
    onValue(todosRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Firebaseから取得したデータを配列に変換
            todos = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
        } else {
            todos = [];
        }
        renderTodos();
    }, (error) => {
        console.error('データ読み込みエラー:', error);
        alert('データの読み込みに失敗しました');
    });
}

// Firebaseにタスクを保存する
function saveTodos() {
    // Firebaseはリアルタイム同期を使用するため、別途保存関数は不要
    // 各操作（addTodo、deleteTodoなど）で直接Firebaseに保存
    renderTodos();
}

// タスク追加
async function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') {
        alert('タスクを入力してください！');
        return;
    }

    const newTodo = {
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    try {
        // Firebaseに新しいタスクを追加
        const newTodoRef = push(todosRef);
        await set(newTodoRef, newTodo);
        todoInput.value = '';
    } catch (error) {
        console.error('タスク追加エラー:', error);
        alert('タスクの追加に失敗しました');
    }
}

// タスク削除
async function deleteTodo(id) {
    try {
        const todoRef = ref(database, `todos/${id}`);
        await remove(todoRef);
    } catch (error) {
        console.error('タスク削除エラー:', error);
        alert('タスクの削除に失敗しました');
    }
}

// タスク完了状態の切り替え
async function toggleTodo(id) {
    try {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        
        const todoRef = ref(database, `todos/${id}`);
        await update(todoRef, {
            completed: !todo.completed
        });
    } catch (error) {
        console.error('タスク状態変更エラー:', error);
        alert('タスクの状態変更に失敗しました');
    }
}

// タスク編集開始
function startEdit(id) {
    editingId = id;
    renderTodos();
}

// タスク編集保存
async function saveEdit(id, newText) {
    if (newText.trim() === '') {
        alert('タスクを入力してください！');
        return;
    }
    
    try {
        const todoRef = ref(database, `todos/${id}`);
        await update(todoRef, {
            text: newText.trim()
        });
        editingId = null;
    } catch (error) {
        console.error('タスク編集エラー:', error);
        alert('タスクの編集に失敗しました');
    }
}

// タスク編集キャンセル
function cancelEdit() {
    editingId = null;
    renderTodos();
}

// フィルター変更
function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    renderTodos();
}

// 完了した項目をすべて削除
async function clearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedCount = completedTodos.length;
    
    if (completedCount === 0) {
        alert('完了した項目がありません！');
        return;
    }
    
    if (confirm(`完了した${completedCount}件の項目を削除しますか？`)) {
        try {
            // すべての完了した項目をFirebaseから削除
            const deletePromises = completedTodos.map(todo => {
                const todoRef = ref(database, `todos/${todo.id}`);
                return remove(todoRef);
            });
            
            await Promise.all(deletePromises);
        } catch (error) {
            console.error('完了項目削除エラー:', error);
            alert('完了した項目の削除に失敗しました');
        }
    }
}

// フィルターされたタスクリストを取得
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// タスクリストのレンダリング
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<li class="empty-state">タスクがありません</li>';
    } else {
        todoList.innerHTML = filteredTodos.map(todo => {
            const isEditing = editingId === todo.id;
            
            if (isEditing) {
                return `
                    <li class="todo-item">
                        <input 
                            type="checkbox" 
                            ${todo.completed ? 'checked' : ''} 
                            onchange="toggleTodo('${todo.id}')"
                            class="todo-checkbox"
                        >
                        <input 
                            type="text" 
                            value="${escapeHtml(todo.text)}" 
                            class="todo-text editing"
                            id="editInput-${todo.id}"
                            onkeypress="handleEditKeyPress(event, '${todo.id}')"
                        >
                        <div class="todo-actions">
                            <button class="save-btn" onclick="saveEdit('${todo.id}', document.getElementById('editInput-${todo.id}').value)">
                                保存
                            </button>
                            <button class="cancel-btn" onclick="cancelEdit()">キャンセル</button>
                        </div>
                    </li>
                `;
            }
            
            return `
                <li class="todo-item ${todo.completed ? 'completed' : ''}">
                    <input 
                        type="checkbox" 
                        ${todo.completed ? 'checked' : ''} 
                        onchange="toggleTodo('${todo.id}')"
                        class="todo-checkbox"
                    >
                    <span class="todo-text">${escapeHtml(todo.text)}</span>
                    <div class="todo-actions">
                        <button class="edit-btn" onclick="startEdit('${todo.id}')">編集</button>
                        <button class="delete-btn" onclick="deleteTodo('${todo.id}')">削除</button>
                    </div>
                </li>
            `;
        }).join('');
    }
    
    // 統計更新
    const totalCount = todos.length;
    const activeCount = todos.filter(todo => !todo.completed).length;
    const completedCount = todos.filter(todo => todo.completed).length;
    todoCount.textContent = `合計${totalCount}件（進行中：${activeCount}件、完了：${completedCount}件）`;
}

// HTMLエスケープ（XSS防止）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 編集モードでのEnterキー処理
function handleEditKeyPress(event, id) {
    if (event.key === 'Enter') {
        const input = document.getElementById(`editInput-${id}`);
        saveEdit(id, input.value);
    } else if (event.key === 'Escape') {
        cancelEdit();
    }
}

// イベントリスナー
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

// グローバル関数として公開（インラインイベントハンドラーで使用）
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
window.startEdit = startEdit;
window.saveEdit = saveEdit;
window.cancelEdit = cancelEdit;
window.handleEditKeyPress = handleEditKeyPress;

// ページロード時にタスクを読み込む
loadTodos();

