/* Global Imports */
import { BrowserRouter, Route, Routes } from 'react-router'

/* Application Level Imports */
import * as UI from '@/components';
import * as Views from '@/views';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Views.Home />} />
        <Route path="/products" element={<Views.Products />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
