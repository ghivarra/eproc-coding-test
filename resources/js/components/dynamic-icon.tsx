import type { LucideIcon } from 'lucide-react'
import Icons from '@/lib/icons'

type IconName = keyof typeof Icons

export function DynamicIcon(name: IconName) {
    return Icons[name] as LucideIcon
}