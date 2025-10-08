"use client"

import useSWR from "swr"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getLogs, getHealth, getApiInfo, getCurrentUser } from "@/lib/api.js"
import { SiteHeader } from "@/components/site-header.jsx"
import { Card } from "@/components/ui/card.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"

const logsFetcher = async () => getLogs(50)
const healthFetcher = async () => getHealth()

export default function DashboardPage() {
  const router = useRouter()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const { data, isLoading, mutate } = useSWR("logs", logsFetcher, {
    revalidateOnFocus: false,
  })
  
  const { data: healthData, isLoading: healthLoading } = useSWR("health", healthFetcher, {
    revalidateOnFocus: false,
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.replace('/signin')
    } else {
      setIsCheckingAuth(false)
    }
  }, [router])

  // Show loader while checking authentication
  if (isCheckingAuth) {
    return (
      <main className="min-h-dvh">
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Checking authentication...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 animate-slow-pulse" aria-hidden="true" />
      <SiteHeader />
      <div className="relative mx-auto max-w-6xl px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Activity logs</h1>
          <Button variant="secondary" onClick={() => mutate()}>
            Refresh
          </Button>
        </div>
        <Card className="px-2 overflow-hidden">
          <Table> 
            <TableHeader>
              <TableRow>
                <TableHead className="text-black" >Timestamp</TableHead>
                <TableHead className="text-black">Action</TableHead>
                <TableHead className="text-black">Actor</TableHead>
                <TableHead className="text-black">Subject</TableHead>
                <TableHead className="text-black">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5}>Loading…</TableCell>
                </TableRow>
              )}
              {data?.logs?.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="whitespace-nowrap">{log.timestamp}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.actor}</TableCell>
                  <TableCell>{log.subject ?? "-"}</TableCell>
                  <TableCell>
                    <pre className="text-xs text-muted-foreground">{JSON.stringify(log.details || {}, null, 2)}</pre>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && data?.logs?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No logs yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </main>
  )
}
