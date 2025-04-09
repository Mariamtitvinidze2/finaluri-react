import React from 'react'
import Header from '../__molecules/Header'
import Footer from '../__molecules/Footer'

const Inside = () => {
  const userId = "123";
  return (
    <div className="flex flex-col h-screen">
    <Header  userId={userId} />
    <Footer/>
    </div>
  )
}

export default Inside
