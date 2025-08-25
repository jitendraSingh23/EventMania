import React from 'react'
import CurrentUser from '@/lib/auth'
import UserInfo from '@/components/user-info';
async function Page  () {
    const user = await CurrentUser();
  return (
    <div className='flex justify-center items-center w-screen h-screen'>

    <UserInfo user={user} label='server component'/>
    </div>
  )
}

export default Page