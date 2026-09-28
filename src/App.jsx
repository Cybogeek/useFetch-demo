import ProductList from "./components/ProductList";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>useFetch Demo</h1>
        <p>A custom React hook fetching live product data</p>
      </header>
      <ProductList />
    </div>
  );
}

export default App;
