"use client"
import { useRouter } from 'next/navigation'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  destination?: string | 'top'
}

export default function Logo({ 
  size = 'md', 
  className = '',
  destination
}: LogoProps) {
  const router = useRouter()
  
  const handleLogoClick = () => {
    if (!destination) return

    if (destination === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push(destination)
    }
  }

  const wrapperSizes = {
    sm: 'h-14 w-52',
    md: 'h-14 w-56',
    lg: 'h-24 w-72'
  }

  const imgSizes = {
    sm: 'h-[250px]',
    md: 'h-[300px]',
    lg: 'h-[400px]'
  }

  const imageOffsets = {
    sm: '-ml-[12px]',
    md: '-ml-[15px]',
    lg: '-ml-[20px]'
  }
  
  return (
    <div 
      className={`relative flex items-center justify-start shrink-0 ${wrapperSizes[size]} ${destination ? 'cursor-pointer' : ''} ${className}`}
      onClick={handleLogoClick}
    >
       <img 
         src="/logo.png"
         alt="Avid Trainings"
         className={`absolute left-0 top-1/2 -translate-y-1/2 ${imageOffsets[size]} ${imgSizes[size]} w-auto max-w-none object-contain pointer-events-none`}
       />
    </div>
  )
}
