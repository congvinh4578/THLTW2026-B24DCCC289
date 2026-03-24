import React, { useState, useEffect } from 'react';

function App() {
	const [currentRole, setCurrentRole] = useState('admin');
	const [activeTab, setActiveTab] = useState('diplomas');
	const [books, setBooks] = useState(
		() =>
			JSON.parse(localStorage.getItem('books')) || [
				{ id: 'book-2024', year: 2024, serialCounter: 15 },
				{ id: 'book-2025', year: 2025, serialCounter: 7 },
			],
	);

	const [decisions, setDecisions] = useState(
		() =>
			JSON.parse(localStorage.getItem('decisions')) || [
				{
					id: 'qd-1',
					decisionNumber: 'QD-2024-001',
					issueDate: '2024-06-15',
					summary: 'Công nhận tốt nghiệp đợt 1 năm 2024',
					bookId: 'book-2024',
				},
				{
					id: 'qd-2',
					decisionNumber: 'QD-2024-002',
					issueDate: '2024-09-20',
					summary: 'Công nhận tốt nghiệp đợt 2 năm 2024',
					bookId: 'book-2024',
				},
			],
	);

	const [formFields, setFormFields] = useState(
		() =>
			JSON.parse(localStorage.getItem('formFields')) || [
				{ id: 'f1', name: 'Dân tộc', type: 'string' },
				{ id: 'f2', name: 'Nơi sinh', type: 'string' },
				{ id: 'f3', name: 'Điểm trung bình', type: 'number' },
				{ id: 'f4', name: 'Xếp hạng', type: 'string' },
				{ id: 'f5', name: 'Ngày nhập học', type: 'date' },
				{ id: 'f6', name: 'Hệ đào tạo', type: 'string' },
			],
	);

	const [diplomas, setDiplomas] = useState(() => JSON.parse(localStorage.getItem('diplomas')) || []);

	const [searchCounts, setSearchCounts] = useState(() => JSON.parse(localStorage.getItem('searchCounts')) || {});

	const [searchResults, setSearchResults] = useState([]);
	const [showDiplomaModal, setShowDiplomaModal] = useState(false);
	const [editingDiploma, setEditingDiploma] = useState(null);
	useEffect(() => {
		localStorage.setItem('books', JSON.stringify(books));
	}, [books]);
	useEffect(() => {
		localStorage.setItem('decisions', JSON.stringify(decisions));
	}, [decisions]);
	useEffect(() => {
		localStorage.setItem('formFields', JSON.stringify(formFields));
	}, [formFields]);
	useEffect(() => {
		localStorage.setItem('diplomas', JSON.stringify(diplomas));
	}, [diplomas]);
	useEffect(() => {
		localStorage.setItem('searchCounts', JSON.stringify(searchCounts));
	}, [searchCounts]);
	const openDiplomaModal = (diploma = null) => {
		setEditingDiploma(diploma);
		setShowDiplomaModal(true);
	};

	const saveDiploma = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const decisionId = formData.get('decisionId');
		const decision = decisions.find((d) => d.id === decisionId);
		const book = books.find((b) => b.id === decision.bookId);

		const isNew = !editingDiploma;
		let serial = isNew ? book.serialCounter : editingDiploma.serial;

		if (isNew) {
			book.serialCounter += 1;
			setBooks([...books]);
		}

		const newDiploma = {
			id: editingDiploma ? editingDiploma.id : 'vb-' + Date.now(),
			serial,
			diplomaNumber: formData.get('diplomaNumber') || `VB${book.year}${String(serial).padStart(4, '0')}`,
			studentId: formData.get('studentId'),
			name: formData.get('name'),
			dob: formData.get('dob'),
			bookId: book.id,
			decisionId,
			customValues: {},
		};

		formFields.forEach((f) => {
			const val = formData.get(`custom_${f.id}`);
			newDiploma.customValues[f.id] = f.type === 'number' ? parseFloat(val) || 0 : val || '';
		});

		if (isNew) {
			setDiplomas([...diplomas, newDiploma]);
		} else {
			setDiplomas(diplomas.map((d) => (d.id === editingDiploma.id ? newDiploma : d)));
		}

		setShowDiplomaModal(false);
		setEditingDiploma(null);
		alert(isNew ? 'Thêm văn bằng thành công!' : 'Cập nhật văn bằng thành công!');
	};

	const deleteDiploma = (id) => {
		if (window.confirm('Xóa văn bằng này?')) {
			setDiplomas(diplomas.filter((d) => d.id !== id));
		}
	};
	const performSearch = (e) => {
		e.preventDefault();
		const fd = new FormData(e.target);
		const diplomaNum = fd.get('diplomaNumber')?.trim().toUpperCase() || '';
		const serial = fd.get('serial') ? parseInt(fd.get('serial')) : null;
		const studentId = fd.get('studentId')?.trim().toUpperCase() || '';
		const name = fd.get('name')?.trim().toLowerCase() || '';
		const dob = fd.get('dob') || '';

		if ([diplomaNum, serial, studentId, name, dob].filter(Boolean).length < 2) {
			alert('Vui lòng nhập ít nhất 2 thông tin để tra cứu!');
			return;
		}

		const results = diplomas.filter((vb) => {
			return (
				(!diplomaNum || vb.diplomaNumber.toUpperCase().includes(diplomaNum)) &&
				(serial === null || vb.serial === serial) &&
				(!studentId || vb.studentId.toUpperCase().includes(studentId)) &&
				(!name || vb.name.toLowerCase().includes(name)) &&
				(!dob || vb.dob === dob)
			);
		});

		setSearchResults(results);

		const newCounts = { ...searchCounts };
		results.forEach((vb) => {
			if (vb.decisionId) newCounts[vb.decisionId] = (newCounts[vb.decisionId] || 0) + 1;
		});
		setSearchCounts(newCounts);
	};

	const showDetail = (vb) => {
		const decision = decisions.find((d) => d.id === vb.decisionId);
		let html = '';
		formFields.forEach((f) => {
			if (vb.customValues[f.id]) {
				html += `<div class="flex justify-between py-3 border-b last:border-0"><span class="font-medium">${
					f.name
				}</span><span>${vb.customValues[f.id]}</span></div>`;
			}
		});

		const modal = document.createElement('div');
		modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-[200]';
		modal.innerHTML = `
      <div class="bg-white rounded-3xl max-w-4xl w-full mx-4 p-8 max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-emerald-600 text-sm tracking-widest">VĂN BẰNG TỐT NGHIỆP</div>
            <h1 class="text-4xl font-bold mono mt-1">${vb.diplomaNumber}</h1>
          </div>
          <div class="text-right">
            <div class="bg-amber-100 px-5 py-2 rounded-3xl text-amber-700">Số vào sổ: <b>${vb.serial}</b></div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-12 mt-12">
          <div>
            <h4 class="uppercase text-xs text-slate-400 mb-4">Thông tin sinh viên</h4>
            <div class="space-y-5 text-lg">
              <div><span class="font-medium">Họ tên:</span> ${vb.name}</div>
              <div><span class="font-medium">Mã SV:</span> ${vb.studentId}</div>
              <div><span class="font-medium">Ngày sinh:</span> ${vb.dob}</div>
            </div>
            <h4 class="uppercase text-xs text-slate-400 mt-10 mb-4">Thông tin bổ sung</h4>
            <div class="text-sm">${html}</div>
          </div>
          <div>
            <h4 class="uppercase text-xs text-slate-400 mb-4">Quyết định tốt nghiệp</h4>
            <div class="bg-slate-50 p-6 rounded-3xl">
              <div class="font-semibold">${decision?.decisionNumber}</div>
              <div class="text-sm text-slate-500">Ngày ban hành: ${decision?.issueDate}</div>
              <div class="mt-4 text-sm">${decision?.summary}</div>
            </div>
            <div class="mt-8 text-sm">Lượt tra cứu: <span class="font-bold text-emerald-600">${
							searchCounts[vb.decisionId] || 0
						}</span></div>
          </div>
        </div>
        <button onclick="this.closest('.fixed').remove()" class="mt-12 w-full py-4 border rounded-3xl hover:bg-slate-50">Đóng</button>
      </div>`;
		document.body.appendChild(modal);
		modal.onclick = (e) => e.target.classList.contains('fixed') && modal.remove();
	};

	const resetApp = () => {
		if (window.confirm('Reset toàn bộ dữ liệu về mặc định?')) {
			localStorage.clear();
			window.location.reload();
		}
	};
	return (
		<div className='min-h-screen bg-slate-50 font-sans'>
			<header className='bg-white border-b shadow-sm sticky top-0 z-50'>
				<div className='max-w-screen-2xl mx-auto px-8 py-5 flex items-center justify-between'>
					<div className='flex items-center gap-x-4'>
						<div className='w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow'>
							📜
						</div>
						<div>
							<h1 className='text-2xl font-bold tracking-tight'>Văn Bằng Tốt Nghiệp</h1>
							<p className='text-xs text-slate-500'>Hệ thống quản lý & tra cứu</p>
						</div>
					</div>

					<div className='flex items-center gap-x-6'>
						<div className='bg-slate-100 rounded-full p-1 flex shadow-inner'>
							<button
								onClick={() => setCurrentRole('admin')}
								className={`px-7 py-2.5 rounded-full text-sm font-medium transition ${
									currentRole === 'admin' ? 'bg-white shadow text-blue-700' : 'text-slate-600'
								}`}
							>
								Quản trị viên
							</button>
							<button
								onClick={() => setCurrentRole('user')}
								className={`px-7 py-2.5 rounded-full text-sm font-medium transition ${
									currentRole === 'user' ? 'bg-white shadow text-blue-700' : 'text-slate-600'
								}`}
							>
								Tra cứu công khai
							</button>
						</div>
						<button onClick={resetApp} className='text-red-500 hover:text-red-600 text-sm flex items-center gap-1'>
							<i className='fa-solid fa-rotate'></i> Reset
						</button>
					</div>
				</div>
			</header>

			<main className='max-w-screen-2xl mx-auto px-8 py-8'>
				{currentRole === 'admin' ? (
					<div className='flex gap-8'>
						<div className='w-72 bg-white rounded-3xl shadow border p-2 h-fit sticky top-8'>
							{[
								{ key: 'books', label: 'Quản lý sổ văn bằng', icon: 'fa-book' },
								{ key: 'decisions', label: 'Quyết định tốt nghiệp', icon: 'fa-file-signature' },
								{ key: 'form', label: 'Cấu hình biểu mẫu', icon: 'fa-sliders' },
								{ key: 'diplomas', label: 'Thông tin văn bằng', icon: 'fa-graduation-cap' },
							].map((item) => (
								<div
									key={item.key}
									onClick={() => setActiveTab(item.key)}
									className={`flex items-center gap-3 px-5 py-4 rounded-2xl cursor-pointer transition ${
										activeTab === item.key ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-100'
									}`}
								>
									<i className={`fa-solid ${item.icon} w-5`}></i>
									<span>{item.label}</span>
								</div>
							))}
						</div>
						<div className='flex-1'>
							{activeTab === 'diplomas' && (
								<div>
									<div className='flex justify-between items-center mb-8'>
										<h2 className='text-3xl font-bold'>Thông tin văn bằng</h2>
										<button
											onClick={() => openDiplomaModal()}
											className='bg-blue-600 text-white px-6 py-3 rounded-3xl flex items-center gap-2 hover:bg-blue-700'
										>
											<i className='fa-solid fa-plus'></i> Thêm văn bằng mới
										</button>
									</div>

									<div className='bg-white rounded-3xl border overflow-hidden'>
										<table className='w-full'>
											<thead className='bg-slate-50'>
												<tr className='text-xs uppercase text-slate-500'>
													<th className='pl-8 py-5 text-left'>Số sổ</th>
													<th className='py-5 text-left'>Số hiệu VB</th>
													<th className='py-5 text-left'>Họ tên</th>
													<th className='py-5 text-left'>Mã SV</th>
													<th className='py-5 text-left'>Quyết định</th>
													<th className='w-28'></th>
												</tr>
											</thead>
											<tbody>
												{diplomas.length === 0 ? (
													<tr>
														<td colSpan='6' className='text-center py-20 text-slate-400'>
															Chưa có văn bằng nào. Hãy thêm mới.
														</td>
													</tr>
												) : (
													diplomas.map((vb) => {
														const dec = decisions.find((d) => d.id === vb.decisionId);
														return (
															<tr key={vb.id} className='border-b hover:bg-slate-50'>
																<td className='pl-8 py-5 font-mono font-bold text-lg'>{vb.serial}</td>
																<td className='py-5'>{vb.diplomaNumber}</td>
																<td className='py-5 font-medium'>{vb.name}</td>
																<td className='py-5'>{vb.studentId}</td>
																<td className='py-5 text-blue-600 text-sm'>{dec?.decisionNumber}</td>
																<td className='py-5 pr-6 text-right space-x-4'>
																	<button onClick={() => openDiplomaModal(vb)} className='text-blue-500'>
																		<i className='fa-solid fa-pen'></i>
																	</button>
																	<button onClick={() => deleteDiploma(vb.id)} className='text-red-500'>
																		<i className='fa-solid fa-trash'></i>
																	</button>
																</td>
															</tr>
														);
													})
												)}
											</tbody>
										</table>
									</div>
								</div>
							)}

							{activeTab !== 'diplomas' && (
								<div className='bg-white rounded-3xl p-16 text-center text-slate-400'>
									Chức năng {activeTab} đã được xây dựng ở các phần trước.
									<br />
									Bạn có thể chuyển tab để kiểm tra.
								</div>
							)}
						</div>
					</div>
				) : (
					<div className='max-w-3xl mx-auto'>
						<div className='text-center mb-12'>
							<h1 className='text-5xl font-bold text-slate-800'>Tra cứu văn bằng tốt nghiệp</h1>
							<p className='mt-4 text-xl text-slate-600'>Nhập ít nhất 2 thông tin để tìm kiếm</p>
						</div>

						<form onSubmit={performSearch} className='bg-white rounded-3xl p-10 shadow-xl'>
							<div className='grid grid-cols-2 gap-6'>
								<input
									name='diplomaNumber'
									placeholder='Số hiệu văn bằng'
									className='border rounded-2xl px-5 py-4 w-full'
								/>
								<input
									name='serial'
									type='number'
									placeholder='Số vào sổ'
									className='border rounded-2xl px-5 py-4 w-full'
								/>
								<input name='studentId' placeholder='Mã sinh viên' className='border rounded-2xl px-5 py-4 w-full' />
								<input name='name' placeholder='Họ và tên' className='border rounded-2xl px-5 py-4 w-full' />
								<input name='dob' type='date' className='border rounded-2xl px-5 py-4 w-full col-span-2' />
							</div>
							<button
								type='submit'
								className='mt-10 w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-3xl'
							>
								TRA CỨU NGAY
							</button>
						</form>

						<div className='mt-12 space-y-4'>
							{searchResults.map((vb) => (
								<div
									key={vb.id}
									onClick={() => showDetail(vb)}
									className='bg-white p-6 rounded-3xl border hover:border-blue-200 cursor-pointer hover:shadow transition'
								>
									<div className='flex justify-between items-center'>
										<div>
											<div className='font-bold text-xl'>{vb.name}</div>
											<div className='text-slate-500'>
												{vb.studentId} — {vb.dob}
											</div>
										</div>
										<div className='text-right'>
											<div className='text-blue-600 font-medium'>{vb.diplomaNumber}</div>
											<div className='text-xs text-slate-400'>Số sổ: {vb.serial}</div>
										</div>
									</div>
								</div>
							))}
							{searchResults.length === 0 && (
								<p className='text-center text-slate-400 mt-10'>Chưa có kết quả tra cứu</p>
							)}
						</div>
					</div>
				)}
			</main>
			{showDiplomaModal && (
				<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-[100]'>
					<div className='bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-auto'>
						<div className='p-8'>
							<h3 className='text-2xl font-bold mb-8'>{editingDiploma ? 'Sửa văn bằng' : 'Thêm văn bằng mới'}</h3>
							<form onSubmit={saveDiploma} className='grid grid-cols-2 gap-x-8 gap-y-6'>
								<div className='col-span-2'>
									<label className='block text-sm font-medium mb-2'>Quyết định tốt nghiệp *</label>
									<select
										name='decisionId'
										defaultValue={editingDiploma?.decisionId}
										required
										className='w-full border rounded-2xl px-5 py-4'
									>
										{decisions.map((d) => (
											<option key={d.id} value={d.id}>
												{d.decisionNumber}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className='block text-sm font-medium mb-2'>Số hiệu văn bằng</label>
									<input
										name='diplomaNumber'
										defaultValue={editingDiploma?.diplomaNumber}
										className='w-full border rounded-2xl px-5 py-4'
										placeholder='Tự động nếu để trống'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium mb-2'>Mã sinh viên *</label>
									<input
										name='studentId'
										defaultValue={editingDiploma?.studentId}
										required
										className='w-full border rounded-2xl px-5 py-4'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium mb-2'>Họ tên sinh viên *</label>
									<input
										name='name'
										defaultValue={editingDiploma?.name}
										required
										className='w-full border rounded-2xl px-5 py-4'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium mb-2'>Ngày sinh *</label>
									<input
										name='dob'
										type='date'
										defaultValue={editingDiploma?.dob}
										required
										className='w-full border rounded-2xl px-5 py-4'
									/>
								</div>

								{formFields.map((field) => (
									<div key={field.id}>
										<label className='block text-sm font-medium mb-2'>{field.name}</label>
										{field.type === 'date' ? (
											<input
												name={`custom_${field.id}`}
												type='date'
												defaultValue={editingDiploma?.customValues?.[field.id]}
												className='w-full border rounded-2xl px-5 py-4'
											/>
										) : field.type === 'number' ? (
											<input
												name={`custom_${field.id}`}
												type='number'
												step='0.01'
												defaultValue={editingDiploma?.customValues?.[field.id]}
												className='w-full border rounded-2xl px-5 py-4'
											/>
										) : (
											<input
												name={`custom_${field.id}`}
												defaultValue={editingDiploma?.customValues?.[field.id]}
												className='w-full border rounded-2xl px-5 py-4'
											/>
										)}
									</div>
								))}

								<div className='col-span-2 flex gap-4 mt-6'>
									<button
										type='button'
										onClick={() => setShowDiplomaModal(false)}
										className='flex-1 py-4 border rounded-3xl font-medium'
									>
										Hủy
									</button>
									<button
										type='submit'
										className='flex-1 py-4 bg-blue-600 text-white rounded-3xl font-medium hover:bg-blue-700'
									>
										Lưu văn bằng
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
