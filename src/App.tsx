import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content(コンテント)") });
  }
  
  // Added 2024/05/13
  function deleteTodo(id: string) {
    const response = prompt("本当に良いですか(Y/N) ?");

    // 正規表現を使って全角半角のYyを判定
    const regex = /^[yYｙＹ]$/;

//    if (response && (response.toLowerCase() === "y")) {
    if (response && regex.test(response)) {
      client.models.Todo.delete({ id });
    }
  }


  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>

      <ul>
        {todos.map((todo) => 
          <li
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}>
            {todo.content}
          </li> )}
      </ul>

      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://next-release-dev.d1ywzrxfkb9wgg.amplifyapp.com/react/start/quickstart/vite-react-app/#step-2-add-delete-to-do-functionality">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
