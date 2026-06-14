import React, { useState, useEffect } from 'react'
import { Head, usePage, router, Link } from '@inertiajs/react'
import { AppShell } from '@/components/organisms/layout/AppShell'
import { ChecklistProgress } from '@/components/organisms/wedding/ChecklistProgress'
import { ChecklistCategoryGroup } from '@/components/molecules/ChecklistCategoryGroup'
import { AddChecklistItemModal } from '@/components/modals/AddChecklistItemModal'
import { EditChecklistItemModal } from '@/components/modals/EditChecklistItemModal'
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal'
import { Plus, CheckCircle2, Circle, Clock, Filter, ListTodo } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/molecules/EmptyState'
import { IllustrationAllDone } from '@/components/atoms/illustrations/IllustrationAllDone'

export default function Checklist({
  couple,
  countdown,
  items_grouped,
  categories,
  filters
}: any) {
  const { auth } = usePage().props as any
  const user = auth.user

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<any | null>(null)
  const [itemToDelete, setItemToDelete] = useState<any | null>(null)
  
  const [activeTab, setAktifTab] = useState(filters.status || 'all')
  const [activeCategory, setAktifCategory] = useState(filters.category || 'all')
  const [activeAssignee, setAktifAssignee] = useState(filters.assigned_to || 'all')

  const totalItems = items_grouped.reduce((sum: number, group: any) => sum + group.total_count, 0)
  const completedItems = items_grouped.reduce((sum: number, group: any) => sum + group.completed_count, 0)
  const terlewatItems = items_grouped.reduce((sum: number, group: any) => sum + group.items.filter((i: any) => i.is_terlewat).length, 0)
  const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
  const isAllComplete = totalItems > 0 && pct === 100

  // Apply frontend filters
  const filteredGroups = items_grouped.map((group: any) => {
    if (activeCategory !== 'all' && group.category !== activeCategory) return null

    const filteredItems = group.items.filter((item: any) => {
      // Status filter
      if (activeTab === 'todo' && item.status !== 'todo') return false
      if (activeTab === 'done' && item.status !== 'done') return false
      if (activeTab === 'terlewat' && !item.is_terlewat) return false
      if (activeTab === 'my_tasks' && item.assigned_to !== 'both' && item.assigned_to !== (user.id === couple.partner_a_id ? 'partner_a' : 'partner_b')) return false
      
      // Assignee filter (explicit dropdown if added, currently handled mostly by 'my_tasks' tab, but we'll leave it in for completeness)
      if (activeAssignee !== 'all' && item.assigned_to !== activeAssignee && item.assigned_to !== 'both') return false

      return true
    })

    if (filteredItems.length === 0) return null

    return {
      ...group,
      items: filteredItems
    }
  }).filter(Boolean)

  const handleToggle = (item: any) => {
    router.put(route('wedding.checklist.update', item.id), {
      ...item,
      // The update expects the full object, we mainly care about status but passing all is easiest
    }, { preserveScroll: true })
  }

  const handleDelete = () => {
    if (!itemToDelete) return
    router.delete(route('wedding.checklist.destroy', itemToDelete.id), {
      preserveScroll: true,
      onSuccess: () => setItemToDelete(null)
    })
  }

  // Confetti effect on completion
  useEffect(() => {
    if (isAllComplete) {
      // Simple celebration logged for MVP
      console.log('All complete!')
    }
  }, [isAllComplete])

  return (
    <AppShell title="Ceklis" coupleName={couple.name} userName={user.display_name} userAvatar={user.avatar_url}>
      
      {isAllComplete && (
        <div className="relative mb-8 bg-gradient-to-r from-pink-500 to-rose-400 rounded-3xl p-8 text-center text-white overflow-hidden shadow-md animate-in fade-in slide-in-from-top-4">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=')] opacity-20 mix-blend-overlay" />
          <div className="relative z-10">
            <div className="text-6xl mb-4 animate-bounce" style={{ animationIterationCount: 3 }}>🎉</div>
            <h2 className="text-3xl font-bold font-serif mb-2">Everything's ready!</h2>
            <p className="text-pink-50 font-medium">Your wedding checklist is complete. You've prepared {totalItems} tasks together. See you at the altar! 💍</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 md:mb-6">Wedding Checklist</h1>
          <ChecklistProgress 
            total={totalItems} 
            completed={completedItems} 
            terlewat={terlewatItems} 
            pct={pct} 
          />
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center px-6 py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-pink-sm self-start md:self-auto shrink-0"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Tugas
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-neutral-950 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-800 shadow-sm mb-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between sticky top-[60px] lg:top-0 z-30">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto space-x-2 w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'todo', label: 'To Do' },
            { id: 'my_tasks', label: 'My Tasks' },
            { id: 'done', label: 'Selesai' },
            { id: 'terlewat', label: 'Overdue' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAktifTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-pink-50 text-pink-700" 
                  : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:bg-neutral-900 hover:text-neutral-900 dark:text-neutral-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-48">
            <Select value={activeCategory} onValueChange={(val) => setAktifCategory(val)}>
              <SelectTrigger className="w-full bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c: string) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div>
        {filteredGroups.length === 0 ? (
          <EmptyState 
            illustration={<IllustrationAllDone />}
            title={activeTab === 'all' && activeCategory === 'all' ? "Your checklist is empty" : "No tasks found"}
            description={activeTab === 'all' && activeCategory === 'all' ? "Add your first task to get started." : "No tasks match your current filters."}
            action={activeTab === 'all' && activeCategory === 'all' ? { label: 'Tambah Tugas', onClick: () => setIsAddModalOpen(true) } : { label: 'Clear filters', onClick: () => { setAktifTab('all'); setAktifCategory('all'); } }}
          />
        ) : (
          filteredGroups.map((group: any) => (
            <ChecklistCategoryGroup
              key={group.category}
              category={group.category}
              items={group.items}
              completedCount={group.completed_count}
              totalCount={group.total_count}
              couple={couple}
              onItemToggle={handleToggle}
              onItemEdit={(item) => setItemToEdit(item)}
              onItemDelete={(item) => setItemToDelete(item)}
            />
          ))
        )}
      </div>

      <AddChecklistItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        couple={couple}
        categories={categories}
      />

      <EditChecklistItemModal
        isOpen={!!itemToEdit}
        onClose={() => setItemToEdit(null)}
        item={itemToEdit}
        couple={couple}
        categories={categories}
      />

      <ConfirmDeleteModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />

    </AppShell>
  )
}



