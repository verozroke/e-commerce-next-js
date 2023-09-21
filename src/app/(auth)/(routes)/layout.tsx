import React, { FC } from 'react'

interface layoutProps {
  children: React.ReactNode
}

const layout: FC<layoutProps> = ({ children }) => {
  return <div className='flex items-center justify-center h-full'>
    {children}
  </div>
}

export default layout