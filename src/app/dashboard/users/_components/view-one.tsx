import { type Selectable } from 'kysely'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import type { User } from '~/kysely/types'
import { enUserRoleToAr } from '~/utils/users'

type Props = {
  user: Omit<Selectable<User>, 'password'>
}

export const ViewOne = ({ user }: Props) => {
  return (
    <>
      <div>
        <div className='space-y-2'>
          <div className='flex justify-center'>
            <Avatar className='h-20 w-20'>
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className='flex items-center justify-center gap-2'>
            <p className='text-center font-bold text-lg'>{user.name}</p>
            <Badge>{enUserRoleToAr(user.role)}</Badge>
          </div>
        </div>
        <Separator className='my-4' />
        <p>البريد الإلكتروني: {user.email}</p>
        {!!user.phone && <p>رقم الهاتف: {user.phone}</p>}
      </div>
    </>
  )
}
