// ✅ LocalStorage와 동기화되는 TodoList
const STORAGE_KEY = 'todoList';

// ✅ LocalStorage에서 불러오기
function loadTodos() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  } else {
    // 기본값 (최초 실행 시)
    const defaultTodos = [
      { id: 1, title: 'JavaScript 공부', done: true, status: '마감', memo: '배열 메서드 복습' },
      { id: 2, title: 'React 공부', done: false, status: '진행중', memo: '컴포넌트 props 실습' },
      { id: 3, title: '바닐라 프로젝트', done: false, status: '시작 전', memo: '' },
      { id: 4, title: 'TypeScript 공부', done: false, status: '시작 전', memo: '' },
      { id: 5, title: 'Final 프로젝트', done: true, status: '마감', memo: '배포 확인' },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTodos));
    return defaultTodos;
  }
}

// ✅ LocalStorage에 저장
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList));
}

// ✅ 전역 todoList (localStorage에서 불러오기)
let todoList = loadTodos();

// ✅ DOM 요소 선택
const ul = document.querySelector('.todolist');
const input = document.querySelector('.todoinput input');
const addBtn = document.querySelector('.todoinput button');
const searchInput = document.querySelector('#searchInput');

// ✅ 필터링
function filter() {
  const keyword = searchInput.value.toLowerCase();
  return todoList.filter(
    (todo) =>
      todo.title.toLowerCase().includes(keyword) ||
      (todo.memo && todo.memo.toLowerCase().includes(keyword))
  );
}

// ✅ 렌더링
function render(list = todoList) {
  ul.innerHTML = '';

  list.forEach((todo) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="title">${todo.done ? `<s>${todo.title}</s>` : todo.title}</span>
      <select>
        <option value="시작 전" ${todo.status === '시작 전' ? 'selected' : ''}>시작 전</option>
        <option value="진행중" ${todo.status === '진행중' ? 'selected' : ''}>진행중</option>
        <option value="마감" ${todo.status === '마감' ? 'selected' : ''}>마감</option>
      </select>
      <button class="del">삭제</button>
      <br>
      <textarea placeholder="메모 작성...">${todo.memo || ''}</textarea>
    `;
    ul.appendChild(li);

    // ✅ 완료 토글
    li.querySelector('.title').addEventListener('click', () => {
      todo.done = !todo.done;
      saveTodos();
      render(filter());
    });

    // ✅ 상태 변경
    li.querySelector('select').addEventListener('change', (e) => {
      todo.status = e.target.value;
      saveTodos();
    });

    // ✅ 삭제
    li.querySelector('.del').addEventListener('click', () => {
      const idx = todoList.indexOf(todo);
      todoList.splice(idx, 1);
      saveTodos();
      render(filter());
    });

    // ✅ 메모 저장
    li.querySelector('textarea').addEventListener('input', (e) => {
      todo.memo = e.target.value;
      saveTodos();
    });
  });
}

// ✅ 할 일 추가
function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now(),
    title: text,
    done: false,
    status: '시작 전',
    memo: '',
  };

  todoList.push(newTodo);
  saveTodos();
  input.value = '';
  render(filter());
}

// ✅ 이벤트 바인딩
addBtn.addEventListener('click', addTodo);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});
searchInput.addEventListener('input', () => render(filter()));

// ✅ 초기 렌더링
render(todoList);