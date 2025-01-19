import { useState } from 'react';
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'
import axios from 'axios';
//import { use } from 'react';


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  //console.clear();
  const [isAuth, setIsAuth] = useState(false);

  const [tempProduct, setTempProduct] = useState([]);
  const [products, setProducts] = useState([]);

  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example"

  })

  const handleInputChange = (e) => {
    const { value, name } = e.target
    //copy account物件值
    setAccount({ ...account, [name]: value })

  }

  const handleLogin = (e) => {
    //console.clear();
    //remove default event
    e.preventDefault();
    // console.log(import.meta.env.VITE_BASE_URL);
    // console.log(import.meta.env.VITE_API_PATH);
    axios.post(`${BASE_URL}/v2/admin/signin`, account)
      .then((res) => {
        const { token, expired } = res.data;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
        // 從 cookie 取得 token
        // const getToken = document.cookie.replace(
        //   /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        //   "$1",
        // );
        //console.log(token, expired, getToken);
        //發送請求前，在headers 裡帶入 token資料，後續動作的請求都會自動帶上Token資料
        axios.defaults.headers.common['Authorization'] = token;
        //console.log(new Date(expired));
        //get product detail
        axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`).then((res) => setProducts(res.data.products))
          .catch((error) => console.error(error));

        setIsAuth(true)
      }).catch((error) => {
        console.log(error.response.data);
        alert('login error');
      })
  }

  const checkLoginOK = async () => {
    try {
      //precondition: put token in header
      await axios.post(`${BASE_URL}/v2/api/user/check`)
      alert('user already logins in')
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {isAuth ?
        (
          // login success
          <div className="container py-5">
            <div className="row">
              <div className="col-6">
                <button onClick={checkLoginOK} type="button" className='btn btn-success mb-3'>check if user already login in</button>
                <h2>產品列表</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">產品名稱</th>
                      <th scope="col">原價</th>
                      <th scope="col">售價</th>
                      <th scope="col">是否啟用</th>
                      <th scope="col">查看細節</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <th scope="row">{product.title}</th>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>{product.is_enabled}</td>
                        <td>
                          <button
                            onClick={() => setTempProduct(product)}
                            className="btn btn-primary"
                            type="button"
                          >
                            查看細節
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-6">
                <h2>單一產品細節</h2>
                {tempProduct.title ? (
                  <div className="card">
                    <img
                      src={tempProduct.imageUrl}
                      className="card-img-top img-fluid"
                      alt={tempProduct.title}
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        {tempProduct.title}
                        <span className="badge text-bg-primary">
                          {tempProduct.category}
                        </span>
                      </h5>
                      <p className="card-text">商品描述：{tempProduct.description}</p>
                      <p className="card-text">商品內容：{tempProduct.content}</p>
                      <p className="card-text">
                        <del>{tempProduct.origin_price} 元</del> / {tempProduct.price}{" "}
                        元
                      </p>
                      <h5 className="card-title">更多圖片：</h5>
                      {tempProduct.imagesUrl?.map((image) => (image && (<img key={image} src={image} className="img-fluid" />)))}
                    </div>
                  </div>
                ) : (
                  <p>請選擇一個商品查看</p>
                )}
              </div>
            </div>
          </div>
        ) :
        (
          //login page
          <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-secondary">
            <h1 className="mb-5">請先登入</h1>
            <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
              <div className="form-floating mb-3">
                <input name="username" value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" />
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input name="password" value={account.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password" />
                <label htmlFor="password">Password</label>
              </div>
              <button className="btn btn-primary">登入</button>
            </form>
            <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
          </div>)}
    </>
  );
}

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

export default App
