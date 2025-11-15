import React from 'react'
import { FaTwitch } from 'react-icons/fa'

const StreamBar = () => {
    return (
        <div className='flex flex-row justify-center items-center bg-purple-700 text-white p-2'>
            <FaTwitch className='w-4 h-4' />
            <span className='ml-2'>En Stream !</span>
            <span className='ml-2'>Vous pouvez nous suivre sur Twitch:
                <a className='underline font-bold' href="https://www.twitch.tv/archetype_battle" target='_blank' rel='noopener noreferrer'>
                     Archetype Battle
                </a>
            </span>
        </div>
    )
}

export default StreamBar