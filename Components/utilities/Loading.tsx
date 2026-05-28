export default function Loading(){
    return (
      <div>
      <div className='flex space-x-2 justify-center items-center bg-white h-screen dark:invert relative'>
        <span className='sr-only'>Loading...</span>
        
        {/* Container adjustment for mobile devices */}
        <div className='absolute transform -translate-y-28 md:translate-y-0 flex space-x-2'>
          <div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
          <div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
          <div className='h-8 w-8 bg-black rounded-full animate-bounce'></div>
        </div>
      </div>
      </div>
    )
  }