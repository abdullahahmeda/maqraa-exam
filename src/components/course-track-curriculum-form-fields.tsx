import {
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormReturn,
  useWatch,
} from 'react-hook-form'
import { api } from '~/trpc/react'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from './ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useEffect } from 'react'
import type { Fields } from '~/types'

type FieldKeys = 'course' | 'track' | 'curriculum'

type FormFields<T extends FieldValues> = Fields<FieldKeys, T>

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>
  fields: FormFields<T>
}

export const CourseTrackCurriculumFormFields = <T extends FieldValues>({
  form,
  fields,
}: Props<T>) => {
  const { control, resetField } = form

  const course = useWatch({ control, name: fields.course })
  const track = useWatch({ control, name: fields.track })

  const { data: courses } = api.course.list.useQuery()

  const tracksDisabled = !course
  const { data: tracks } = api.track.list.useQuery(
    { filters: { courseId: course } },
    { enabled: !tracksDisabled },
  )

  const curriculaDisabled = !course || !track
  const { data: curricula } = api.curriculum.list.useQuery(
    {
      filters: { trackId: track },
      include: { parts: true },
    },
    { enabled: !curriculaDisabled },
  )

  useEffect(() => {
    resetField(fields.track, { defaultValue: null as PathValue<T, Path<T>> })
  }, [course])

  useEffect(() => {
    resetField(fields.curriculum, {
      defaultValue: null as PathValue<T, Path<T>>,
    })
  }, [track])

  return (
    <>
      <FormField
        control={control}
        name={fields.course}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المقرر</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='اختر المقرر' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {courses?.data.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={fields.track}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المسار</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={tracksDisabled}
            >
              <FormControl>
                <SelectTrigger
                // loading={
                //   tracksFetchStatus === 'fetching' && isTracksLoading
                // }
                >
                  <SelectValue placeholder='اختر المسار' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tracks?.data.map((track) => (
                  <SelectItem key={track.id} value={track.id}>
                    {track.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {tracksDisabled && (
              <FormDescription>يجب اختيار المقرر أولاً</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={fields.curriculum}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المنهج</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={curriculaDisabled}
            >
              <FormControl>
                <SelectTrigger
                // loading={
                //   curriculaFetchStatus === 'fetching' &&
                //   isCurriculaLoading
                // }
                >
                  <SelectValue placeholder='اختر المنهج' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {curricula?.data.map((curriculum) => (
                  <SelectItem key={curriculum.id} value={curriculum.id}>
                    {curriculum.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {curriculaDisabled && (
              <FormDescription>يجب اختيار المقرر والمسار أولاً</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
