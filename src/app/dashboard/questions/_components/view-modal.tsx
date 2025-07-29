'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { api } from '~/trpc/react'
import { Spinner } from '~/components/ui/spinner'
import { type ReactNode, createContext, useState, useContext } from 'react'
import { Badge } from '~/components/ui/badge'
import { columnMapping, enDifficultyToAr, enTypeToAr } from '~/utils/questions'
import invert from 'lodash.invert'

type Id = undefined | string

const ModalContext = createContext({
  questionId: undefined as Id,
  setQuestionId: (_id: Id) => {},
})

export function useViewModal() {
  return useContext(ModalContext)
}

export function ViewModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [questionId, _setQuestionId] = useState<Id>()
  const setQuestionId = (v: Id) => {
    _setQuestionId(v)
    setOpen(true)
  }
  return (
    <ModalContext.Provider
      value={{
        questionId: questionId,
        setQuestionId,
      }}
    >
      {children}
      <Modal open={open} id={questionId} setOpen={setOpen} />
    </ModalContext.Provider>
  )
}

function Content({ id }: { id: string }) {
  const {
    data: question,
    isLoading,
    isError,
  } = api.question.getShow.useQuery({ id })

  if (isError) {
    return <p className='text-red-600'>حدث خطأ أثناء التحميل</p>
  }

  if (isLoading) {
    return (
      <div className='flex justify-center'>
        <Spinner className='h-4 w-4' />
      </div>
    )
  }

  if (!question) {
    return <p className='text-red-600'>هذا المستخدم غير موجود</p>
  }

  return (
    <div>
      <p>رقم الصفحة: {question.pageNumber}</p>
      <p>رقم الجزء: {question.partNumber}</p>
      <p>رقم الحديث: {question.hadithNumber}</p>
      <p>رقم السؤال: {question.number}</p>
      <p>نص السؤال: {question.text}</p>
      <p>نوع السؤال: {enTypeToAr(question.type)}</p>
      <p>أسلوب السؤال: {question.style?.name}</p>
      {question.type === 'MCQ' && (
        <div className='flex items-center'>
          <p>الإختيارات: </p>
          <div className='flex gap-1'>
            {question.style?.choicesColumns.map((column) => (
              <Badge key={column}>{invert(columnMapping)[column]}</Badge>
            ))}
          </div>
        </div>
      )}
      <p>المقرر: {question.course?.name}</p>
      <p>الإجابة الصحيحة: {question.answer}</p>
      <p>إجابة أخرى: {question.anotherAnswer}</p>
      <p>الهدف: {question.objective}</p>
      <p>المستوى: {enDifficultyToAr(question.difficulty)}</p>
      <p>داخل المظلل: {question.isInsideShaded ? 'نعم' : 'لا'}</p>
    </div>
  )
}

function Modal({
  open,
  id,
  setOpen,
}: {
  open: boolean
  id: Id
  setOpen: (v: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>عرض سؤال</DialogTitle>
        </DialogHeader>
        {id != undefined && <Content id={id} />}
      </DialogContent>
    </Dialog>
  )
}
