import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  BottomSheet,
  BottomSheetFlatList,
  BottomSheetRef,
} from '../../bottomsheet';
import type { FilterDashboardOrg } from '../../form/form/entity';
import { TreeSelectProps } from '../entity';

interface FlatTreeNode {
  item: FilterDashboardOrg;
  depth: number;
  hasChildren: boolean;
}

type SelectionState = 'none' | 'partial' | 'selected';

const normalizeText = (value: string): string =>
  value.trim().toLocaleLowerCase('vi-VN');

const flattenAllItems = (
  nodes: FilterDashboardOrg[],
): FilterDashboardOrg[] =>
  nodes.flatMap(node => [node, ...flattenAllItems(node.children ?? [])]);

const collectSubtreeIds = (
  node: FilterDashboardOrg,
  result: number[] = [],
): number[] => {
  result.push(node.id);
  node.children?.forEach(child => collectSubtreeIds(child, result));
  return result;
};

const synchronizeParentSelection = (
  nodes: FilterDashboardOrg[],
  selectedIds: Set<number>,
): void => {
  nodes.forEach(node => {
    const children = node.children ?? [];

    if (children.length === 0) {
      return;
    }

    synchronizeParentSelection(children, selectedIds);

    if (children.every(child => selectedIds.has(child.id))) {
      selectedIds.add(node.id);
    } else {
      selectedIds.delete(node.id);
    }
  });
};

const createSelectionSet = (
  data: FilterDashboardOrg[],
  selectedItems: FilterDashboardOrg[],
): Set<number> => {
  const itemById = new Map(flattenAllItems(data).map(item => [item.id, item]));
  const selectedIds = new Set<number>();

  selectedItems.forEach(selectedItem => {
    const sourceItem = itemById.get(selectedItem.id) ?? selectedItem;
    collectSubtreeIds(sourceItem).forEach(id => selectedIds.add(id));
  });

  synchronizeParentSelection(data, selectedIds);
  return selectedIds;
};

const buildSelectionStates = (
  nodes: FilterDashboardOrg[],
  selectedIds: Set<number>,
): Map<number, SelectionState> => {
  const states = new Map<number, SelectionState>();

  const visitNode = (node: FilterDashboardOrg): SelectionState => {
    const childStates = (node.children ?? []).map(visitNode);
    const selected = selectedIds.has(node.id);
    const hasSelectedChild = childStates.some(state => state !== 'none');
    const state: SelectionState = selected
      ? 'selected'
      : hasSelectedChild
        ? 'partial'
        : 'none';

    states.set(node.id, state);
    return state;
  };

  nodes.forEach(visitNode);
  return states;
};

const filterTree = (
  nodes: FilterDashboardOrg[],
  searchValue: string,
): FilterDashboardOrg[] => {
  const query = normalizeText(searchValue);

  if (!query) {
    return nodes;
  }

  return nodes.reduce<FilterDashboardOrg[]>((result, node) => {
    const children = filterTree(node.children ?? [], searchValue);
    const searchableText = normalizeText(`${node.orgName} ${node.orgCode}`);

    if (searchableText.includes(query)) {
      result.push(node);
    } else if (children.length > 0) {
      result.push({ ...node, children });
    }

    return result;
  }, []);
};

const flattenVisibleTree = (
  nodes: FilterDashboardOrg[],
  expandedIds: Set<number>,
  expandAll: boolean,
  depth = 0,
): FlatTreeNode[] => {
  const result: FlatTreeNode[] = [];

  nodes.forEach(item => {
    const hasChildren = Boolean(item.children?.length);
    result.push({ item, depth, hasChildren });

    if (hasChildren && (expandAll || expandedIds.has(item.id))) {
      result.push(
        ...flattenVisibleTree(
          item.children ?? [],
          expandedIds,
          expandAll,
          depth + 1,
        ),
      );
    }
  });

  return result;
};

const getIndentStyle = (depth: number): ViewStyle => ({
  marginLeft: depth * 18,
});

export const TreeSelect = ({
  data = [],
  itemSelected = [],
  label,
  onSelected,
  disabled = false,
  error,
  searchBox = true,
  snapHeight = 620,
  containerStyle,
  textStyle,
}: TreeSelectProps): React.ReactElement => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const allItems = useMemo(() => flattenAllItems(data), [data]);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set());
  const [draftSelectedIds, setDraftSelectedIds] = useState<Set<number>>(() =>
    createSelectionSet(data, itemSelected),
  );
  const [searchValue, setSearchValue] = useState('');

  const visibleNodes = useMemo(() => {
    const filteredTree = filterTree(data, searchValue);
    return flattenVisibleTree(
      filteredTree,
      expandedIds,
      searchValue.trim().length > 0,
    );
  }, [data, expandedIds, searchValue]);

  const selectionStates = useMemo(
    () => buildSelectionStates(data, draftSelectedIds),
    [data, draftSelectedIds],
  );

  const openSheet = useCallback(() => {
    if (disabled) {
      return;
    }

    Keyboard.dismiss();
    setDraftSelectedIds(createSelectionSet(data, itemSelected));
    setSearchValue('');
    bottomSheetRef.current?.open();
  }, [data, disabled, itemSelected]);

  const toggleExpanded = useCallback((id: number) => {
    setExpandedIds(current => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const toggleItem = useCallback(
    (item: FilterDashboardOrg) => {
      setDraftSelectedIds(current => {
        const next = new Set(current);
        const subtreeIds = collectSubtreeIds(item, []);
        const entireSubtreeSelected = subtreeIds.every(id => next.has(id));

        subtreeIds.forEach(id => {
          if (entireSubtreeSelected) {
            next.delete(id);
          } else {
            next.add(id);
          }
        });

        synchronizeParentSelection(data, next);
        return next;
      });
    },
    [data],
  );

  const applySelection = useCallback(() => {
    const selectedItems = allItems.filter(item =>
      draftSelectedIds.has(item.id),
    );

    onSelected?.(selectedItems);
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
  }, [allItems, draftSelectedIds, onSelected]);

  const renderItem = useCallback(
    ({ item: row }: { item: FlatTreeNode }) => {
      const selectionState = selectionStates.get(row.item.id) ?? 'none';
      const selected = selectionState === 'selected';
      const partial = selectionState === 'partial';
      const expanded =
        searchValue.trim().length > 0 || expandedIds.has(row.item.id);

      return (
        <View style={[styles.indentContainer, getIndentStyle(row.depth)]}>
          <View
            style={[
              styles.treeRow,
              selected && styles.treeRowSelected,
              partial && styles.treeRowPartial,
            ]}
          >
            {row.hasChildren ? (
              <TouchableOpacity
                accessibilityLabel={expanded ? 'Thu gọn' : 'Mở rộng'}
                accessibilityRole="button"
                hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
                onPress={() => toggleExpanded(row.item.id)}
                style={styles.expandButton}
              >
                <View style={styles.expandCircle}>
                  <Text style={styles.expandIcon}>{expanded ? '−' : '+'}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.expandPlaceholder} />
            )}

            <TouchableOpacity
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              activeOpacity={0.72}
              onPress={() => toggleItem(row.item)}
              style={styles.nodeButton}
            >
              <View
                style={[
                  styles.checkbox,
                  selected && styles.checkboxSelected,
                  partial && styles.checkboxPartial,
                ]}
              >
                {selected ? <Text style={styles.checkboxMark}>✓</Text> : null}
                {partial ? <View style={styles.partialMark} /> : null}
              </View>

              <View style={styles.nodeTextContainer}>
                <Text
                  numberOfLines={2}
                  style={[styles.nodeName, selected && styles.nodeNameSelected]}
                >
                  {row.item.orgName}
                </Text>
                <View style={styles.nodeMetaRow}>
                  {row.item.orgCode ? (
                    <Text style={styles.nodeCode}>{row.item.orgCode}</Text>
                  ) : null}
                  {row.hasChildren ? (
                    <Text style={styles.childCount}>
                      {row.item.children?.length ?? 0} đơn vị trực thuộc
                    </Text>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [expandedIds, searchValue, selectionStates, toggleExpanded, toggleItem],
  );

  const placeholder = `Chọn ${label.toLowerCase()}`;
  const selectedCount = itemSelected.length;
  const displayValue =
    selectedCount === 0
      ? placeholder
      : selectedCount === 1
        ? itemSelected[0].orgName
        : `${selectedCount} đơn vị đã chọn`;

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        activeOpacity={0.82}
        disabled={disabled}
        onPress={openSheet}
        style={[
          styles.selectButton,
          disabled && styles.selectButtonDisabled,
          error && styles.selectButtonError,
        ]}
      >
        <View style={styles.selectContent}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text
            numberOfLines={1}
            style={[
              styles.selectText,
              selectedCount === 0 && styles.placeholderText,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {displayValue}
          </Text>
        </View>

        {selectedCount > 0 && !disabled ? (
          <TouchableOpacity
            accessibilityLabel="Xóa lựa chọn"
            accessibilityRole="button"
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            onPress={() => onSelected?.([])}
            style={styles.clearButton}
          >
            <Text style={styles.clearIcon}>×</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.chevronCircle}>
            <Text style={[styles.chevron, disabled && styles.disabledText]}>
              ▾
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <BottomSheet ref={bottomSheetRef} snapHeight={snapHeight}>
        <View style={styles.sheetHeader}>
          <View style={styles.titleRow}>
            <View style={styles.titleContent}>
              <Text style={styles.sheetTitle}>Chọn {label.toLowerCase()}</Text>
              <Text style={styles.sheetSubtitle}>
                Chọn đơn vị cha để chọn toàn bộ đơn vị trực thuộc
              </Text>
            </View>
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>
                {draftSelectedIds.size}
              </Text>
            </View>
          </View>

          {searchBox ? (
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                autoCorrect={false}
                onChangeText={setSearchValue}
                placeholder={`Tìm theo tên hoặc mã ${label.toLowerCase()}`}
                placeholderTextColor="rgba(255,255,255,0.42)"
                style={styles.searchInput}
                value={searchValue}
              />
              {searchValue ? (
                <TouchableOpacity onPress={() => setSearchValue('')}>
                  <Text style={styles.searchClear}>×</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </View>

        <BottomSheetFlatList
          contentContainerStyle={[
            styles.sheetContent,
            visibleNodes.length === 0 && styles.sheetContentEmpty,
          ]}
          data={visibleNodes}
          keyboardShouldPersistTaps="handled"
          keyExtractor={row => String(row.item.id)}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>⌕</Text>
              <Text style={styles.emptyTitle}>Không tìm thấy đơn vị</Text>
              <Text style={styles.emptyText}>Thử tìm bằng tên hoặc mã khác</Text>
            </View>
          }
          renderItem={renderItem}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setDraftSelectedIds(new Set())}
            style={styles.clearAllButton}
          >
            <Text style={styles.clearAllText}>Bỏ chọn tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={applySelection}
            style={styles.applyButton}
          >
            <Text style={styles.applyButtonText}>
              Áp dụng ({draftSelectedIds.size})
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D9E2EC',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selectButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
  selectButtonError: {
    borderColor: '#DC2626',
  },
  selectContent: {
    flex: 1,
  },
  fieldLabel: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 4,
  },
  selectText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
  },
  placeholderText: {
    color: '#94A3B8',
    fontWeight: '400',
  },
  disabledText: {
    color: '#94A3B8',
  },
  clearButton: {
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    marginLeft: 12,
    width: 32,
  },
  clearIcon: {
    color: '#64748B',
    fontSize: 21,
    lineHeight: 23,
  },
  chevronCircle: {
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    marginLeft: 12,
    width: 32,
  },
  chevron: {
    color: '#475569',
    fontSize: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 6,
  },
  sheetHeader: {
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleContent: {
    flex: 1,
    paddingRight: 12,
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  sheetSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    marginTop: 5,
  },
  selectedBadge: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 32,
    minWidth: 32,
    paddingHorizontal: 9,
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 13,
  },
  searchIcon: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 22,
    marginRight: 8,
  },
  searchInput: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 14,
    height: 48,
    paddingVertical: 0,
  },
  searchClear: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 22,
    paddingLeft: 8,
  },
  sheetContent: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  sheetContentEmpty: {
    flexGrow: 1,
  },
  indentContainer: {
    marginBottom: 8,
  },
  treeRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 62,
    paddingRight: 12,
  },
  treeRowSelected: {
    backgroundColor: 'rgba(37,99,235,0.22)',
    borderColor: 'rgba(96,165,250,0.55)',
  },
  treeRowPartial: {
    backgroundColor: 'rgba(245,158,11,0.10)',
    borderColor: 'rgba(245,158,11,0.38)',
  },
  expandButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    width: 42,
  },
  expandPlaceholder: {
    width: 16,
  },
  expandCircle: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 11,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  expandIcon: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 18,
  },
  nodeButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    minHeight: 60,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.38)',
    borderRadius: 6,
    borderWidth: 1.5,
    height: 22,
    justifyContent: 'center',
    marginRight: 11,
    width: 22,
  },
  checkboxSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#60A5FA',
  },
  checkboxPartial: {
    backgroundColor: '#D97706',
    borderColor: '#FBBF24',
  },
  checkboxMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 17,
  },
  partialMark: {
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    height: 2,
    width: 10,
  },
  nodeTextContainer: {
    flex: 1,
    paddingVertical: 9,
  },
  nodeName: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19,
  },
  nodeNameSelected: {
    color: '#DBEAFE',
    fontWeight: '700',
  },
  nodeMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
  nodeCode: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '600',
    marginRight: 10,
  },
  childCount: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 11,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 260,
  },
  emptyIcon: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 38,
  },
  emptyTitle: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    marginTop: 5,
  },
  footer: {
    borderTopColor: 'rgba(255,255,255,0.10)',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  clearAllButton: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    height: 46,
    justifyContent: 'center',
  },
  clearAllText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '600',
  },
  applyButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 10,
    flex: 1.4,
    height: 46,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
