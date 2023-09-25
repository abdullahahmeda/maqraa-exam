import { api } from '~/utils/api'
import { DialogHeader } from '../ui/dialog'
import { Loader2 } from 'lucide-react'
import { enUserRoleToAr } from '~/utils/users'
import { Separator } from '../ui/separator'
import { Progress } from '../ui/progress'

export const UserInfoModal = ({ id }: { id: string }) => {
  const {
    data: user,
    isLoading,
    error,
  } = api.user.findFirstOrThrow.useQuery({
    where: { id },
    include: {
      student: { include: { cycles: { include: { cycle: true } } } },
      corrector: { include: { course: true, cycle: true } },
    },
  })

  const { data: overallPerformance } =
    api.student.getOverallPerformance.useQuery(user?.student?.id as string, {
      enabled: !!user?.student?.id,
    })

  if (isLoading)
    return (
      <div className='flex justify-center'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </div>
    )

  if (error)
    return (
      <p className='text-center text-red-600'>
        {error.message || 'حدث خطأ ما'}
      </p>
    )

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        نبذة عن المستخدم
      </DialogHeader>
      <div>
        <p>الاسم: {user.name}</p>
        <p>الإيميل: {user.email}</p>
        {user.phone && <p>رقم الهاتف: {user.phone}</p>}
        <p>الصلاحيات: {enUserRoleToAr(user.role)}</p>
        {user.role === 'CORRECTOR' && (
          <>
            <Separator className='my-2' />
            <h3 className='font-semibold'>معلومات عن المصحح</h3>
            <p>الدورة: {user.corrector!.cycle!.name}</p>
            <p>المقرر: {user.corrector!.course!.name}</p>
          </>
        )}
        {user.role === 'STUDENT' && (
          <>
            <Separator className='my-2' />
            <h3 className='font-semibold'>معلومات عن الطالب</h3>
            {overallPerformance === null ? (
              <p className='text-gray-500'>لم يتم حساب المستوى العام</p>
            ) : (
              <>
                <p>المستوى العام</p>
                <p>{overallPerformance}%</p>
                <Progress value={overallPerformance} />
              </>
            )}
            {/* <p>
              الدورات: {user.student!.cycles.map(({ cycle }) => cycle.name).join('، ')}
            </p> */}
          </>
        )}
      </div>
    </>
  )
}
