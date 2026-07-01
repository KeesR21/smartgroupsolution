"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";
import { AdminButton } from "@/components/admin/ui/Button";
import {
  EmptyState,
  ListSkeleton,
  SearchInput,
  inputClass,
} from "@/components/admin/ui/Primitives";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { getLucideIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { CollectionConfig } from "@/types/admin";

type Item = { id: string; order: number; published: boolean } & Record<string, unknown>;
/** Loose shape accepted from server pages (typed record arrays are structurally compatible). */
type ManagedRecord = { id: string; order: number; published: boolean };
type Filter = "all" | "published" | "draft";
type Sort = "order" | "az" | "za";

const PAGE_SIZE = 8;

function Thumb({ config, item }: { config: CollectionConfig; item: Item }) {
  const imageValue = config.imageField ? (item[config.imageField] as string) : "";
  if (imageValue) {
    return (
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
        <Image src={imageValue} alt="" fill className="object-cover" unoptimized />
      </div>
    );
  }
  const Icon = getLucideIcon((item.icon as string) || config.icon);
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-neon-blue/15 text-neon-cyan">
      <Icon className="h-5 w-5" />
    </div>
  );
}

function Row({
  config,
  item,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onTogglePublish,
  draggable,
}: {
  config: CollectionConfig;
  item: Item;
  selected: boolean;
  onSelect: (id: string, v: boolean) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  onTogglePublish: (item: Item) => void;
  draggable: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, disabled: !draggable });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const title = String(item[config.primaryField] ?? "Untitled");
  const subtitle = config.subtitleField ? String(item[config.subtitleField] ?? "") : "";

  return (
    <div ref={setNodeRef} style={style} className="glass flex items-center gap-3 rounded-xl p-3.5">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onSelect(item.id, e.target.checked)}
        className="h-4 w-4 shrink-0 accent-neon-cyan"
        aria-label={`Select ${title}`}
      />
      {draggable ? (
        <button
          type="button"
          className="cursor-grab text-[var(--text-muted)] transition-colors hover:text-white active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-5 w-5" />
        </button>
      ) : null}
      <Thumb config={config} item={item} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-[var(--text-primary)]">{title}</p>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              item.published
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-white/10 text-[var(--text-muted)]"
            )}
          >
            {item.published ? "Live" : "Draft"}
          </span>
        </div>
        {subtitle && <p className="truncate text-xs text-[var(--text-muted)]">{subtitle}</p>}
      </div>
      <button
        type="button"
        onClick={() => onTogglePublish(item)}
        className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-white/10 hover:text-neon-cyan"
        aria-label={item.published ? "Unpublish" : "Publish"}
        title={item.published ? "Unpublish" : "Publish"}
      >
        {item.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-white/10 hover:text-neon-cyan"
        aria-label={`Edit ${title}`}
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(item)}
        className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
        aria-label={`Delete ${title}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function CollectionManager({
  config,
  initialItems,
}: {
  config: CollectionConfig;
  initialItems: ManagedRecord[];
}) {
  const { notify } = useNotifications();
  const confirm = useConfirm();

  const [items, setItems] = useState<Item[]>(() => initialItems as Item[]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("order");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => setItems(initialItems as Item[]), [initialItems]);
  useEffect(() => setPage(1), [query, filter, sort]);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/collections/${config.key}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load");
      setItems(await res.json());
      setSelected(new Set());
    } catch {
      notify({ type: "error", title: "Could not refresh list" });
    } finally {
      setLoading(false);
    }
  };

  const canReorder =
    config.reorderable && query.trim() === "" && filter === "all" && sort === "order";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...items];
    if (q) {
      list = list.filter((it) =>
        [config.primaryField, config.subtitleField]
          .filter(Boolean)
          .some((f) => String(it[f as string] ?? "").toLowerCase().includes(q))
      );
    }
    if (filter !== "all") {
      list = list.filter((it) => (filter === "published" ? it.published : !it.published));
    }
    if (sort === "order") list.sort((a, b) => a.order - b.order);
    else {
      list.sort((a, b) => {
        const av = String(a[config.primaryField] ?? "").toLowerCase();
        const bv = String(b[config.primaryField] ?? "").toLowerCase();
        return sort === "az" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return list;
  }, [items, query, filter, sort, config]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = canReorder ? filtered : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allVisibleSelected = paged.length > 0 && paged.every((i) => selected.has(i.id));

  const toggleSelect = (id: string, v: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (v) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) paged.forEach((i) => next.delete(i.id));
      else paged.forEach((i) => next.add(i.id));
      return next;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex).map((it, idx) => ({
      ...it,
      order: idx,
    }));
    setItems(reordered);
    try {
      const res = await fetch(`/api/collections/${config.key}/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderedIds: reordered.map((i) => i.id) }),
      });
      if (!res.ok) throw new Error();
      notify({ type: "info", title: "Order saved", durationMs: 2000 });
    } catch {
      notify({ type: "error", title: "Failed to save order" });
      refresh();
    }
  };

  const togglePublish = async (item: Item) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, published: !i.published } : i))
    );
    try {
      const res = await fetch(`/api/collections/${config.key}/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ published: !item.published }),
      });
      if (!res.ok) throw new Error();
      notify({
        type: "success",
        title: item.published ? "Unpublished" : "Published",
        durationMs: 2000,
      });
    } catch {
      notify({ type: "error", title: "Update failed" });
      refresh();
    }
  };

  const handleDelete = async (item: Item) => {
    const ok = await confirm({
      title: `Delete ${config.singular.toLowerCase()}?`,
      message: `"${String(item[config.primaryField])}" will be permanently removed.`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/collections/${config.key}/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      notify({ type: "success", title: `${config.singular} deleted` });
      await refresh();
    } catch {
      notify({ type: "error", title: "Delete failed" });
    }
  };

  const bulk = async (action: "delete" | "publish" | "unpublish") => {
    const ids = [...selected];
    if (ids.length === 0) return;
    if (action === "delete") {
      const ok = await confirm({
        title: `Delete ${ids.length} item${ids.length > 1 ? "s" : ""}?`,
        message: "This action cannot be undone.",
        confirmLabel: "Delete all",
        tone: "danger",
      });
      if (!ok) return;
    }
    try {
      const res = await fetch(`/api/collections/${config.key}/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action, ids }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      notify({ type: "success", title: `${data.count} item(s) updated` });
      await refresh();
    } catch {
      notify({ type: "error", title: "Bulk action failed" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={`Search ${config.label.toLowerCase()}...`}
            className="sm:max-w-xs sm:flex-1"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            className={cn(inputClass, "sm:w-40")}
            aria-label="Filter"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className={cn(inputClass, "sm:w-44")}
            aria-label="Sort"
          >
            <option value="order">Manual order</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>
        </div>
        <AdminButton icon={Plus} onClick={() => { setEditing(null); setFormOpen(true); }}>
          New {config.singular}
        </AdminButton>
      </div>

      {selected.size > 0 && (
        <div className="glass flex flex-wrap items-center gap-3 rounded-xl p-3">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <div className="flex flex-wrap gap-2">
            <AdminButton variant="secondary" icon={Eye} onClick={() => bulk("publish")}>
              Publish
            </AdminButton>
            <AdminButton variant="secondary" icon={EyeOff} onClick={() => bulk("unpublish")}>
              Unpublish
            </AdminButton>
            <AdminButton variant="danger" icon={Trash2} onClick={() => bulk("delete")}>
              Delete
            </AdminButton>
          </div>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="ml-auto text-xs text-[var(--text-muted)] hover:text-white"
          >
            Clear selection
          </button>
        </div>
      )}

      {loading ? (
        <ListSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Plus className="h-6 w-6" />}
          title={query || filter !== "all" ? "No matches" : `No ${config.label.toLowerCase()} yet`}
          message={
            query || filter !== "all"
              ? "Try adjusting your search or filters."
              : `Create your first ${config.singular.toLowerCase()} to get started.`
          }
          action={
            <AdminButton icon={Plus} onClick={() => { setEditing(null); setFormOpen(true); }}>
              New {config.singular}
            </AdminButton>
          }
        />
      ) : (
        <>
          <div className="flex items-center gap-3 px-1 text-xs text-[var(--text-muted)]">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4 accent-neon-cyan"
              aria-label="Select all"
            />
            <span>
              {filtered.length} {config.label.toLowerCase()}
              {canReorder ? " · drag to reorder" : ""}
            </span>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={paged.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {paged.map((item) => (
                  <Row
                    key={item.id}
                    config={config}
                    item={item}
                    selected={selected.has(item.id)}
                    onSelect={toggleSelect}
                    onEdit={(it) => { setEditing(it); setFormOpen(true); }}
                    onDelete={handleDelete}
                    onTogglePublish={togglePublish}
                    draggable={canReorder}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {!canReorder && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-white disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-[var(--text-muted)]">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-white disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      {formOpen && (
        <CollectionForm
          config={config}
          item={editing as (Item & { id: string; published: boolean }) | null}
          onClose={() => setFormOpen(false)}
          onSaved={async () => {
            setFormOpen(false);
            await refresh();
          }}
        />
      )}
    </div>
  );
}
