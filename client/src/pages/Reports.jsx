import { useState } from 'react';
import { reportAPI } from '../services/api';
import { FiDownload, FiMail, FiFileText, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportType, setReportType] = useState('all');
  const [loading, setLoading] = useState({
    pdf: false,
    csv: false,
    email: false
  });

  const handleDownloadPDF = async () => {
    try {
      setLoading({ ...loading, pdf: true });
      const params = { ...dateRange };
      if (reportType !== 'all') params.type = reportType;

      const response = await reportAPI.downloadPDF(params);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expense-report-${Date.now()}.pdf`;
      link.click();
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF');
      console.error(error);
    } finally {
      setLoading({ ...loading, pdf: false });
    }
  };

  const handleDownloadCSV = async () => {
    try {
      setLoading({ ...loading, csv: true });
      const params = { ...dateRange };
      if (reportType !== 'all') params.type = reportType;

      const response = await reportAPI.downloadCSV(params);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expense-report-${Date.now()}.csv`;
      link.click();
      
      toast.success('CSV downloaded successfully');
    } catch (error) {
      toast.error('Failed to download CSV');
      console.error(error);
    } finally {
      setLoading({ ...loading, csv: false });
    }
  };

  const handleSendEmail = async () => {
    try {
      setLoading({ ...loading, email: true });
      const data = { ...dateRange };
      if (reportType !== 'all') data.type = reportType;

      await reportAPI.sendEmail(data);
      toast.success('Report sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send email');
      console.error(error);
    } finally {
      setLoading({ ...loading, email: false });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-gray-600 dark:text-gray-400">Generate and download financial reports</p>
      </div>

      {/* Report Configuration */}
      <div className="card space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiFileText /> Report Configuration
        </h3>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FiCalendar className="inline mr-2" /> Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FiCalendar className="inline mr-2" /> End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        {/* Report Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setReportType('all')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                reportType === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setReportType('income')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                reportType === 'income'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Income Only
            </button>
            <button
              onClick={() => setReportType('expense')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                reportType === 'expense'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Expense Only
            </button>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => {
              const today = new Date();
              setDateRange({
                startDate: new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
              });
            }}
            className="btn-secondary"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => {
              const today = new Date();
              setDateRange({
                startDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
              });
            }}
            className="btn-secondary"
          >
            This Month
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
              setDateRange({
                startDate: lastMonth.toISOString().split('T')[0],
                endDate: new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0]
              });
            }}
            className="btn-secondary"
          >
            Last Month
          </button>
          <button
            onClick={() => {
              const today = new Date();
              setDateRange({
                startDate: new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
              });
            }}
            className="btn-secondary"
          >
            This Year
          </button>
        </div>
      </div>

      {/* Download Options */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Download & Share</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={loading.pdf}
            className="flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors disabled:opacity-50"
          >
            <div className="p-3 bg-red-600 rounded-full mb-3">
              <FiDownload className="text-white text-2xl" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              {loading.pdf ? 'Generating...' : 'Download PDF'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Get a detailed PDF report
            </p>
          </button>

          {/* Download CSV */}
          <button
            onClick={handleDownloadCSV}
            disabled={loading.csv}
            className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-colors disabled:opacity-50"
          >
            <div className="p-3 bg-green-600 rounded-full mb-3">
              <FiFileText className="text-white text-2xl" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              {loading.csv ? 'Generating...' : 'Download CSV'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Export data in CSV format
            </p>
          </button>

          {/* Send Email */}
          <button
            onClick={handleSendEmail}
            disabled={loading.email}
            className="flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-colors disabled:opacity-50"
          >
            <div className="p-3 bg-blue-600 rounded-full mb-3">
              <FiMail className="text-white text-2xl" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              {loading.email ? 'Sending...' : 'Email Report'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Send report to your email
            </p>
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FiFileText className="text-white" size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Report Information</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Reports include all transactions within the selected date range. PDF reports contain detailed summaries, while CSV files are suitable for importing into spreadsheet applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
