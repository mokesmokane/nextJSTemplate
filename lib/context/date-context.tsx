"use client"

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback
} from "react"
import { startOfDay, addDays, format, isSameDay } from "date-fns"
import type { DateWindow } from "@/types/date-types"

interface DateContextType {
  selectedDate: Date
  isLoading: boolean
  dateWindow: DateWindow
  days: string[]
  loadDates: (date: Date) => void
  setSelectedDate: (date: Date) => void
  addToEndOfDateWindow: () => void
  addToStartOfDateWindow: () => void
}

const DateContext = createContext<DateContextType | undefined>(undefined)

const DAYS_TO_LOAD = 7

// Helper function to generate column data

export function DateProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setDate] = useState<Date>(startOfDay(new Date()))
  const [dateWindow, setDateWindow] = useState<DateWindow>(() => {
    const today = startOfDay(new Date())
    return {
      startDate: today,
      endDate: addDays(today, DAYS_TO_LOAD)
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  const loadDates = (date: Date) => {
    //if the week before the date window add the week before the date window
    if (date < dateWindow.startDate) {
      setDateWindow({
        startDate: addDays(date, -7),
        endDate: date
      })
    }
    //if the week after the date window add the week after the date window
    if (date > dateWindow.endDate) {
      setDateWindow({
        startDate: date,
        endDate: addDays(date, 7)
      })
    }
    //if the date is more than a week out of the date window, load the date window with teh date in the middle and a week before and after
    if (
      date < addDays(dateWindow.startDate, -7) ||
      date > addDays(dateWindow.endDate, 7)
    ) {
      setDateWindow({
        startDate: addDays(date, -7),
        endDate: addDays(date, 7)
      })
    }
  }

  const addToEndOfDateWindow = () => {
    setDateWindow({
      startDate: dateWindow.startDate,
      endDate: addDays(dateWindow.endDate, 7)
    })
  }

  const addToStartOfDateWindow = () => {
    setDateWindow({
      startDate: addDays(dateWindow.startDate, -7),
      endDate: dateWindow.endDate
    })
  }

  const setSelectedDate = (date: Date) => {
    //check if date is in dateWindow
    const isInDateWindow =
      date >= dateWindow.startDate && date <= dateWindow.endDate
    if (!isInDateWindow) {
      loadDates(date)
    }
    setDate(date)
  }

  // Calculate days between start and end dates of the window
  const days = []
  let currentDate = dateWindow.startDate
  while (currentDate <= dateWindow.endDate) {
    days.push(format(currentDate, "yyyy-MM-dd"))
    currentDate = addDays(currentDate, 1)
  }

  return (
    <DateContext.Provider
      value={{
        selectedDate,
        days,
        dateWindow,
        isLoading,
        loadDates,
        setSelectedDate,
        addToStartOfDateWindow,
        addToEndOfDateWindow
      }}
    >
      {children}
    </DateContext.Provider>
  )
}

export function useDate() {
  const context = useContext(DateContext)
  if (!context) {
    throw new Error("useDate must be used within a DateProvider")
  }
  return context
}
