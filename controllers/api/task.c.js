const environment = process.env.NODE_ENV;
const stage = require("../../config/index")[environment];
const taskModel = require("../../models/task.m");

exports.getItems = async (req, res, next) => {
	try {
		const user = req.user;
		let { p, l, c, o, st, ic } = req.query;
		let search = { userName: user.username };

		p = p || 1; // page
		l = l || 20; // limit
		c = c || ""; // category
		ic = ic || "2"; // is completed
		o = o || "added-desc"; // order
		st = st || ""; // search

		p = parseInt(p);
		l = parseInt(l);

		if (l === 0 || l === NaN) l = 20;
		if (p === 0 || p === NaN) p = 1;
		if (c) search.category = c;
		if (ic && ic !== "2") search.isCompleted = (ic === 0 || ic === "0") 
		? false : true;
		if (st) search.text = {$regex: st, $options: "ig"};

		if(o === "add-date-asc") o = { dateCreated: -1 };
		else if(o === "add-date-desc")  o = { dateCreated: 1 };
		else if(o === "due-date-asc")  o = { dateDue: 1 };
		else if(o === "due-date-desc") o = { dateDue: -1 };
		else if(o === "category-asc")  o = { category: 1 };
		else if(o === "category-desc") o = { category: -1 };
		
		const count = await taskModel.find(search).count();
		const items = await taskModel
			.find(search)
			.sort(o)
			.limit(l)
			.skip((p - 1) * l)
			.lean();

		return res.status(200).json({
			count,
			records: items
		});
	} catch (err) {
		next(err);
	}
};

exports.getCategories = async (req, res, next) => {
	const user = req.user;
	const categories = await taskModel
	.distinct("category", { userName: user.username }).lean();
	return res.status(200).json({ categories });
};

exports.getItemById = async (req, res, next) => {
	try {
		const user = req.user;
		const { recordId } = req.params;
		let item = await taskModel.findOne({ 
			_id: recordId, 
			userName: user.username 
		}).lean();
		return res.status(200).json({ item });
	} catch (err) {
		next(err);
	}
};

exports.updateItemById = async (req, res, next) => {
	try {
		const user = req.user;
		const { recordId } = req.params;
		const { text, dateDue, dateClosed, 
			reminder, category, isCompleted } = req.body;
		let item = await taskModel.findOne({ 
			_id: recordId, 
			userName: user.username 
		});

		item.text = text;
		item.dateDue = dateDue;
		item.dateClosed = dateClosed;
		item.reminder = reminder;
		item.category = category;
		item.isCompleted = isCompleted;

		await item.save();

		return res.status(200).json({ item });
	} catch (err) {
		next(err);
	}
};

exports.toggleCompleteStatus = async (req, res, next) => {
	try {
		const user = req.user;
		const { recordId } = req.params;
		const { isCompleted } = req.body;

		let item = await taskModel.findOne({ 
			_id: recordId, 
			userName: user.username 
		});

		item.isCompleted = isCompleted;
		item.dateClosed = isCompleted ? new Date() : null;

		await item.save();
		
		return res.status(200).json({ item });
	} catch (err) {
		next(err);
	}
};

exports.addItem = async (req, res, next) => {
	try {
		const user = req.user;
		const { text, dateDue, dateClosed, 
			reminder, category, isCompleted } = req.body;

		const newItem = await new taskModel({
			userName: user.username, 
			dateCreated: new Date(), 
			text, dateDue,
            dateClosed, reminder, 
            category, isCompleted
		});
		await newItem.save();
		return res.status(200).json({ item: newItem });
	} catch (err) {
		next(err);
	}
};

exports.deleteItemById = async (req, res, next) => {
	try {
		const user = req.user;
		const { recordId } = req.params;
		const deleteRes = await taskModel.deleteOne({ 
			_id: recordId, 
			userName: user.username 
		});
		if (deleteRes.deletedCount === 1) {
			return res.status(200).json(deleteRes);
		}

		return res.status(400).json({
			title: "Error",
			message: "Failed to delete record",
			type: "danger"
		});
	} catch (err) {
		next(err);
	}
};
