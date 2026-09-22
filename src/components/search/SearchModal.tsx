import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import {
  Modal,
  ModalContent,
} from '@/components/ui/Modal';
import { publications } from '@/content/publications';
import { projects } from '@/content/projects';
import { talks } from '@/content/talks';
import { createSearchableItem, filterSearchableItems } from '@/lib/search';
import { useSearchStore } from '@/stores/searchStore';
import { Tag } from '@/components/ui/Tag';
import { FileText, Folder, Presentation } from 'lucide-react';
import type { SearchableItem } from '@/types';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const navigate = useNavigate();
  const { filters } = useSearchStore();
  const [search, setSearch] = useState('');

  // Create searchable items from all content
  const allItems = useMemo(() => {
    return [
      ...publications.map((p) => createSearchableItem(p, 'publication')),
      ...projects.map((p) => createSearchableItem(p, 'project')),
      ...talks.map((t) => createSearchableItem(t, 'talk')),
    ];
  }, []);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    return filterSearchableItems(allItems, { ...filters, query: search });
  }, [allItems, filters, search]);

  const handleSelect = (item: SearchableItem) => {
    const routes: Record<string, string> = {
      publication: `/publications/${item.id}`,
      project: `/research#${item.id}`,
      talk: `/about#talks`,
    };

    navigate(routes[item.type]);
    onOpenChange(false);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const getIcon = (type: SearchableItem['type']) => {
    switch (type) {
      case 'publication':
        return <FileText className="h-4 w-4" />;
      case 'project':
        return <Folder className="h-4 w-4" />;
      case 'talk':
        return <Presentation className="h-4 w-4" />;
    }
  };

  const getLabel = (type: SearchableItem['type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-2xl p-0">
        <Command className="rounded-lg border-0 shadow-none">
          <div className="flex items-center border-b px-3">
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search publications, projects, talks..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {['publication', 'project', 'talk'].map((type) => {
              const items = filteredItems.filter((item) => item.type === type);
              if (items.length === 0) return null;

              return (
                <Command.Group
                  key={type}
                  heading={`${getLabel(type as SearchableItem['type'])}s`}
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {items.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.type}-${item.id}-${item.title}`}
                      onSelect={() => handleSelect(item)}
                      className="relative flex cursor-pointer select-none items-start gap-3 rounded-sm px-2 py-3 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <div className="mt-0.5">{getIcon(item.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="line-clamp-1 text-xs text-muted-foreground">
                          {item.description}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.year && (
                            <Tag variant="muted" className="text-[10px] px-1.5 py-0">
                              {item.year}
                            </Tag>
                          )}
                          {item.status && (
                            <Tag variant="muted" className="text-[10px] px-1.5 py-0">
                              {item.status}
                            </Tag>
                          )}
                        </div>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>
        </Command>
      </ModalContent>
    </Modal>
  );
}
