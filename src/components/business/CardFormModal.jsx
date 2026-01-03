import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { storeConfig } from '../../config/store';

const CardFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    // Estado inicial do formulário
    const defaultState = {
        name: '',
        img: '',
        collection: '',
        condition: 'NM (Near Mint)',
        language: 'PT-BR',
        cost: 0,
        initialValue: 0,
        stockOwner: storeConfig.inventoryOwners[0]?.id || '',
        category: 'Outros'
    };

    const [formData, setFormData] = useState(defaultState);

    // Atualiza o formulário quando abre ou quando os dados de edição mudam
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    ...defaultState,
                    ...initialData,
                    // Garante que números sejam tratados corretamente
                    cost: Number(initialData.cost) || 0,
                    initialValue: Number(initialData.initialValue) || 0
                });
            } else {
                setFormData(defaultState);
            }
        }
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Estilo comum para selects para bater com o Input.jsx
    const selectClass = "w-full p-2 bg-black/20 border border-[#D946EF]/20 rounded-lg text-[#F1F5F9] focus:outline-none focus:border-[#D946EF] transition-colors appearance-none";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Editar Carta" : "Novo Item no Estoque"}
        >
            <form id="card-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Coluna da Esquerda: Campos do Formulário (Ocupa 2/3) */}
                <div className="md:col-span-2 space-y-4">
                    <Input
                        label="Nome da Carta"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex: Charizard Base Set"
                        required
                    />

                    <Input
                        label="URL da Imagem"
                        id="img"
                        value={formData.img}
                        onChange={handleChange}
                        placeholder="https://..."
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Coleção"
                            id="collection"
                            value={formData.collection}
                            onChange={handleChange}
                            placeholder="Ex: 151"
                        />
                         <div>
                            <label className="block font-bold text-[#F1F5F9] mb-1">Idioma</label>
                            <select
                                id="language"
                                value={formData.language}
                                onChange={handleChange}
                                className={selectClass}
                            >
                                <option value="PT-BR">Português (PT-BR)</option>
                                <option value="EN">Inglês (EN)</option>
                                <option value="JP">Japonês (JP)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-[#F1F5F9] mb-1">Condição</label>
                            <select
                                id="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className={selectClass}
                            >
                                {storeConfig.conditions?.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold text-[#F1F5F9] mb-1">Categoria</label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={selectClass}
                            >
                                {storeConfig.categories.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Custo (R$)"
                            id="cost"
                            type="number"
                            step="0.01"
                            value={formData.cost}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Preço Inicial Sugerido (R$)"
                            id="initialValue"
                            type="number"
                            step="0.01"
                            value={formData.initialValue}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-[#F1F5F9] mb-1">Dono do Estoque</label>
                        <select
                            id="stockOwner"
                            value={formData.stockOwner}
                            onChange={handleChange}
                            className={selectClass}
                        >
                            {storeConfig.inventoryOwners.map(owner => (
                                <option key={owner.id} value={owner.id}>
                                    {owner.label || owner.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Coluna da Direita: Preview (Ocupa 1/3) */}
                <div className="flex flex-col items-center justify-start pt-6">
                    <span className="text-gray-400 mb-2 text-sm">Pré-visualização</span>
                    <div className="w-full aspect-[2/3] bg-black/40 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden relative">
                        {formData.img ? (
                            <img 
                                src={formData.img} 
                                alt="Preview" 
                                className="w-full h-full object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }} // Esconde se der erro
                            />
                        ) : (
                            <div className="text-center text-gray-500">
                                <span className="text-4xl block mb-2">📷</span>
                                <span className="text-xs">Sem imagem</span>
                            </div>
                        )}
                        {/* Overlay com informações básicas */}
                        {formData.img && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-center">
                                <p className="text-white font-bold text-xs truncate">{formData.name || 'Nome da Carta'}</p>
                                <p className="text-[#D946EF] font-bold text-xs">R$ {Number(formData.initialValue).toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 w-full">
                        <Button type="submit" variant="gradient" className="w-full">
                            {initialData ? 'Salvar Alterações' : 'Cadastrar Item'}
                        </Button>
                    </div>
                </div>

            </form>
        </Modal>
    );
};

export default CardFormModal;