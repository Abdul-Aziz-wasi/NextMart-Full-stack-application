import React from 'react'

function Unauthorized() {
  return (
    <div className='h-screen flex flex-col bg-gray-200 justify-center items-center'>
        <h1 className='text-3xl font-bold text-red-500'>Access denied🚫</h1>
        <p className='text-gray-700 mt-2'>You can not access this page</p>
    </div>
  )
}

export default Unauthorized