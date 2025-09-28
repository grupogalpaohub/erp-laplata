'use client'

interface AddItemButtonProps {
  materials: Array<{
    mm_material: string
    mm_comercial: boolean // mapeado no código
    mm_desc: string
  }>
}

export default function AddItemButton({ materials }: AddItemButtonProps) {
  const addItem = () => {
    const container = document.getElementById('items-container')
    if (!container) return

    const newItem = document.createElement('div')
    newItem.className = 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'
    newItem.innerHTML = `
      <div>
        <label class="block text-sm font-medium text-gray-700">Material *</label>
        <select name="materials[]" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          <option value="">Selecione...</option>
          ${(materials || []).map(m => `<option value="${m.mm_material}">${m.mm_material} - ${m.mm_desc}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Quantidade *</label>
        <input type="number" name="quantities[]" required step="0.01" min="0" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="0.00" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Preço Unit. (R$) *</label>
        <input type="number" name="unit_costs[]" required step="0.01" min="0" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="0.00" />
      </div>
      <div class="flex items-end">
        <button type="button" onclick="removeItem(this)" class="w-full bg-red-100 text-red-700 py-2 px-3 border border-red-300 rounded-md text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          - Remover
        </button>
      </div>
    `
    container.appendChild(newItem)
  }

  return (
    <button
      type="button"
      onClick={addItem}
      className="w-full bg-gray-100 text-gray-700 py-2 px-3 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      + Adicionar Item
    </button>
  )
}

