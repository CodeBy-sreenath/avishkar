'use client'
import ShinyText from '@/components/ShinyText'
import React from 'react'

const page = () => {
    return (
        <>
            <section id='autoshow' className='h-screen bg-black flex item-center justify-center'>
                <ShinyText
                    text="Coming Soon..."
                    speed={2}
                    delay={0}
                    color="#b5b5b5"
                    shineColor="#ffffff"
                    spread={120}
                    direction="left"
                    yoyo={false}
                    pauseOnHover={false}
                    disabled={false}
                />
            </section>
            <section id='proshow1' className='h-screen bg-black flex item-center justify-center'>
                <ShinyText
                    text="Coming Soon..."
                    speed={2}
                    delay={0}
                    color="#b5b5b5"
                    shineColor="#ffffff"
                    spread={120}
                    direction="left"
                    yoyo={false}
                    pauseOnHover={false}
                    disabled={false}
                />
            </section>
            <section id='proshow2' className='h-screen bg-black flex item-center justify-center'>
                <ShinyText
                    text="Coming Soon..."
                    speed={2}
                    delay={0}
                    color="#b5b5b5"
                    shineColor="#ffffff"
                    spread={120}
                    direction="left"
                    yoyo={false}
                    pauseOnHover={false}
                    disabled={false}
                />
            </section>
        </>
    )
}

export default page