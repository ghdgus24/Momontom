const pendingList = document.getElementById("js-pending"); // ul
const finishedList = document.getElementById("js-finished"); // ul
const taskForm = document.getElementById("js-HomeWorkForm"); // form
const taskInput = document.getElementById("homeWorkInput");

const PENDING = "PENDING";
const FINISHED = "FINISHED";

let pendingTasks, finishedTasks;

function getTaskObject(text) { //할일의 객체를 가져오는 함수
  return {
    id: String(Date.now()), // 왜 이거 쓰는거지?
    text
  };
}

function savePendingTask(task) {
  pendingTasks.push(task); // handleFormSubmit 에서 받은 getTaskObj 객체를 받는듯
}

function findInFinished(taskId) {
  return finishedTasks.find(function(task){
    return task.id === taskId;
  });
}

function findInPending(taskId) {
  return pendingTasks.find(function(task){
    return task.id === taskId;
  });
}

function removeFromPending(taskId) {
  pendingTasks = pendingTasks.filter(function(task) {
    return task.id !== taskId;
  });
}

function removeFromFinished(taskId) {
  finishedTasks = finishedTasks.filter(function(task){
    return task.id !== taskId;
  });
}

function addToFinished(task) {
  finishedTasks.push(task);
}

function addToPending(task) {
  pendingTasks.push(task);
}

function deleteTask(e) {
  const li = e.target.parentNode;
  li.parentNode.removeChild(li);
  removeFromFinished(li.id);
  removeFromPending(li.id);
  saveState();
}

function handleFinishClick(e) {
  const li = e.target.parentNode;
  li.parentNode.removeChild(li);
  const task = findInPending(li.id);
  removeFromPending(li.id);
  addToFinished(task);
  paintFinishedTask(task);
  saveState();
}

function handleBackClick(e) {
  const li = e.target.parentNode;
  li.parentNode.removeChild(li);
  const task = findInFinished(li.id);
  removeFromFinished(li.id);
  addToPending(task);
  paintPendingTask(task);
  saveState();
}

function buildGenericLi(task) { // 공통의 li를 만드는 함수
  const li = document.createElement("li");
  const span = document.createElement("span");
  const deleteBtn = document.createElement("button");
  span.innerText = task.text;
  deleteBtn.innerText = "❌";
  deleteBtn.addEventListener("click", deleteTask);
  li.append(span, deleteBtn);
  li.id = task.id;
  return li;
}

function paintPendingTask(task) {
  const genericLi = buildGenericLi(task);
  const completeBtn = document.createElement("button");
  completeBtn.innerText = "✅";
  completeBtn.addEventListener("click", handleFinishClick);
  genericLi.append(completeBtn);
  pendingList.append(genericLi);
  // paint 할때 새로운 li를 만들어 각 ul에 append 시킴 finished 도 마찬가지
}

function paintFinishedTask(task) {
  const genericLi = buildGenericLi(task);
  const backBtn = document.createElement("button");
  backBtn.innerText = "⏪";
  backBtn.addEventListener("click", handleBackClick);
  genericLi.append(backBtn);
  finishedList.append(genericLi);
}

function saveState() { // 현재 상태를 LS 에 저장하는 함수
  localStorage.setItem(PENDING, JSON.stringify(pendingTasks));
  localStorage.setItem(FINISHED, JSON.stringify(finishedTasks));
}

function loadState() {
  pendingTasks = JSON.parse(localStorage.getItem(PENDING)) || [];
  finishedTasks = JSON.parse(localStorage.getItem(FINISHED)) || [];
  // || [] 이건 뭐지, 배열을 불러온다는건가
}

function restoreState() {
  pendingTasks.forEach(function(task){
    paintPendingTask(task);
  });
  finishedTasks.forEach(function(task){
    paintFinishedTask(task);
  });
  // 이 부분 아직 이해가 잘 안됨
}

function handleFormSubmit(e) {
  e.preventDefault();
  const taskObj = getTaskObject(taskInput.value);
  taskInput.value = "";
  paintPendingTask(taskObj);
  savePendingTask(taskObj);
  saveState();
}

function init() {
  taskForm.addEventListener("submit", handleFormSubmit);
  loadState();
  restoreState();
}
init();
