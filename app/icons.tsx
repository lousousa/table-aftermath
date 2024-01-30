import { SVGProps } from 'react'

export const TrashCanIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill="currentColor" d="M8 26a3 3 0 0 0 3 3h10c1.656 0 3-1.344 3-3l2-16H6l2 16zm11-13h2v13h-2V13zm-4 0h2v13h-2V13zm-4 0h2v13h-2V13zm14.5-7H19s-.448-2-1-2h-4c-.553 0-1 2-1 2H6.5C5.671 6 5 6.671 5 7.5V9h22V7.5A1.5 1.5 0 0 0 25.5 6z"/>
  </svg>
)

export const CheckMarkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill="currentColor" d="M16 3C8.82 3 3 8.82 3 16s5.82 13 13 13 13-5.82 13-13S23.18 3 16 3zm7.258 9.307-9.486 9.485a.61.61 0 0 1-.861 0l-.191-.191-.001.001L7.5 16.346a.61.61 0 0 1 0-.862l1.294-1.293a.61.61 0 0 1 .862 0l3.689 3.716 7.756-7.756a.61.61 0 0 1 .862 0l1.294 1.294a.609.609 0 0 1 .001.862z"/>
  </svg>
)
