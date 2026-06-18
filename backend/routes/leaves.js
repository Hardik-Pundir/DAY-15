const router = require('express').Router();
const LeaveRequest = require('../models/LeaveRequest');
const { protect, role } = require('../middleware/auth');

// Employee: apply for leave
router.post('/apply', protect, role('EMPLOYEE'), async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start)
      return res.status(400).json({ message: 'End date must be after start date' });

    // Overlap check: exclude rejected leaves
    const overlap = await LeaveRequest.findOne({
      employee: req.user.id,
      status: { $ne: 'REJECTED' },
      startDate: { $lte: end },
      endDate:   { $gte: start }
    });
    if (overlap)
      return res.status(400).json({ message: 'Leave request overlaps with an existing request' });

    const leave = await LeaveRequest.create({
      employee: req.user.id, startDate: start, endDate: end, reason
    });
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Employee: view own leave history
router.get('/my-history', protect, role('EMPLOYEE'), async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user.id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Manager: view all pending requests
router.get('/pending', protect, role('MANAGER'), async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: 'PENDING' })
      .populate('employee', 'name username')
      .sort({ createdAt: 1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Manager: approve or reject
router.put('/:id/action', protect, role('MANAGER'), async (req, res) => {
  try {
    const { status, managerComment } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    if (leave.status !== 'PENDING')
      return res.status(400).json({ message: 'Request already processed' });

    leave.status = status;
    leave.managerComment = managerComment || '';
    await leave.save();
    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
