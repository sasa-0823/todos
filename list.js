
const todos = [
  // {
  //   id: id++,
  //   text: "きゅうりを買う",
  //   done: true,
  //   fav: true,
  //   date: ""
  // },
  // {
  //   id: id++,
  //   text: "メールをする",
  //   done: true,・・・タスク完了・未完了
  //   fav: false,・・・優先度
  //   todoDeadline: false,
  //   deleteDate:"",
  //   date: ""
  // }
];

const idSelect = (todos) => {
  if (todos && todos.length > 0) {
    return Math.max(...todos.map(todo => todo.id)) + 1;
  } else {
    return 0;
  }
};

let id = idSelect(todos);

let loadDate = new Date();

const myData = {
  appName: "BigTodo",
  todos: todos,
  newTodo: "", // 追加するtodo
  newDate: "", // 追加するtodoの期限
  editId: 0, // 編集するtodoのidの取得用
  editTodo: "",
  editDate: "",
  editTodoWord: "",
  boolean: false, // 編集画面・main画面の表示切替用
  changeDisplay: true, // タスク完了・未完了の表示切替用
};



const app = Vue.createApp({
  data() {
    return myData;
  },
  // ローカルストレージからデータを取得
  beforeMount() {
    const getData = localStorage.getItem('myTodo')
    if (getData) {
      this.todos = JSON.parse(getData);
    }
    // 日付が未入力の場合"期限なし"と表記
    this.todos.forEach(todo => {
      if (!todo.date) { todo.date = "期限なし"; }
    });
    // タスクのIDを初期化
    id = idSelect(this.todos);
  },

  created() {
    console.log(this.todos);
  },

  updated() {
    //タスク完了後3日でタスクを消す。
    this.todos.forEach(todo=>{
      if(this.loadDate-new Date(todo.deleteDate)/1000/3600/24 >= 0){
        this.todos=this.todos.filter(t=>t.done===true)
      }
      console.log(todos)
    });
    // DOM更新時にローカルストレージにdataを保存
    const updateDom = JSON.stringify(this.todos);
    localStorage.setItem('myTodo', updateDom);
    // 日付が未入力の場合"期限なし"と表記
    this.todos.forEach(todo => {
      if (!todo.date) { todo.date = "期限なし"; }
      else if ((new Date(todo.date) - this.loadDate) / 1000 / 3600 / 24 <= 1) {
        todo.todoDeadline = true;
      }
      else { todo.todoDeadline = false; }
    });
    

  },

  computed: {
    selectTodos() {
      return this.changeDisplay
        ? this.sortTrue.filter(t => t.done === true)
        : this.sortFalse.filter(t => t.done === false);
    },
    // 未完了タスク表示画面のソート(1は降順-1は昇順)
    sortTrue() {
      return this.todos.sort((a, b) => {
        if (a.fav > b.fav) return -1;
        if (a.fav < b.fav) return 1;
        if (a.id > b.id) return 1;
        if (a.id < b.id) return -1;
        return 0;
      });
    },
    // 完了タスク表示画面のソート
    sortFalse() {
      return this.todos.sort((a, b) => {
        return a.id - b.id;
      });
    }
  },

  methods: {
    // TodoをTodosに追加
    addTodo() {
      if (this.newTodo) {
        this.todos.push({ id: id++, text: this.newTodo, done: true, fav: false, date: this.newDate, todoDeadline: false });
        this.newTodo = "";
        this.newDate = "";
        console.log(this.todos);
      }
    },
    // Todoを編集（編集画面ダイアログ表示)
    editingTodo(todo) {
      this.boolean = true; // ダイアログの表示・main画面の非表示
      this.editTodoWord = todo.text;
      this.editId = todo.id;
      console.log(this.editId);
    },
    // Todo内容の編集完了(編集完了ボタンで入力値を元の値に代入)
    editCompleted() {
      const todo = this.todos.find(t => t.id === this.editId);
      if (todo) {
        if (this.editTodo !== "") {
          todo.text = this.editTodo;
        }
        if (this.editDate !== "") {
          todo.date = this.editDate;
        } else {
          todo.date = "期限なし";
        }
        // 値のリセット
        this.editId = 0;
        this.editTodo = "";
        this.editDate = "";
        this.editTodoWord = "";
        console.log(this.todos);
      }
      this.boolean = false; // ダイアログの非表示・main画面の表示
    },
    // タスク完了後の処理
    completedTodo(todo) {
      todo.done = !todo.done;
      if (todo.done == false) {
        todo.deleteDate = loadDate;
      } else { todo.deleteDate = ""; }
    },

    // ,
    // // IDの再振り分け
    // updateId() {
    //   id = 0;
    //   this.todos.forEach(todo => {
    //     todo.id = id++;
    //   });
    // },
    // タスクに期限を設定する(編集画面内で任意の値を入力)
    // settingPeriod() {
    //   return false;
    // }
  }
});

app.mount("#app");