
import React from 'react';
import { motion } from 'framer-motion';
import { PanbehCharacterAnimated } from '../PanbehCharacterAnimated';
import { Button } from '../ui/button';
import { Download, ChevronLeft } from 'lucide-react';

const invoices = [
    { id: '#PNBH-1024', date: '۱۴۰۳/۰۴/۱۵', amount: '۹۹,۰۰۰', status: 'پرداخت شده' },
];

const EmptyState = ({ onNavigate }) => (
     <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white/50 backdrop-blur-lg rounded-3xl p-12 border border-white/50 shadow-md flex flex-col items-center"
     >
        <div className="relative w-32 h-32 mb-4">
            <div className="absolute inset-0 bg-yellow-200 rounded-full blur-2xl opacity-70"></div>
            <PanbehCharacterAnimated size={120} expression="writing" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">تاریخچه صورت‌حساب خالی است!</h2>
        <p className="text-gray-600 mb-6 max-w-sm">هر وقت خریدی انجام بدی، فاکتورش اینجا برای تو نمایش داده میشه.</p>
        <Button onClick={() => onNavigate('plans')} className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-8 py-3 shadow-lg hover:shadow-orange-400/50 transition-all hover:-translate-y-1 flex items-center gap-2">
            <span>مشاهده پلن‌ها</span>
             <ChevronLeft size={18} />
        </Button>
     </motion.div>
);

const BillingTable = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 backdrop-blur-lg rounded-3xl p-6 border border-white/50 shadow-md"
    >
        <div className="overflow-x-auto">
            <table className="w-full text-right min-w-[600px]">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="p-3 font-bold text-gray-600 text-sm">شماره فاکتور</th>
                        <th className="p-3 font-bold text-gray-600 text-sm">تاریخ</th>
                        <th className="p-3 font-bold text-gray-600 text-sm">مبلغ</th>
                        <th className="p-3 font-bold text-gray-600 text-sm">وضعیت</th>
                        <th className="p-3 font-bold text-gray-600 text-sm"></th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice, index) => (
                         <motion.tr 
                            key={invoice.id} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-gray-200/50 hover:bg-gray-50/30">
                            <td className="p-4 font-semibold text-gray-800">{invoice.id}</td>
                            <td className="p-4 text-gray-600">{invoice.date}</td>
                            <td className="p-4 text-gray-700 font-bold">{invoice.amount} تومان</td>
                            <td className="p-4">
                                <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">{invoice.status}</span>
                            </td>
                            <td className="p-4 text-left">
                                <Button size="sm" className="rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold">
                                    <Download size={16}/>
                                </Button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    </motion.div>
);

const DashboardBilling = ({ onNavigate, hasActivePlan }) => {
    return (
        <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-8">صورت‌حساب‌ها</h1>

            {hasActivePlan ? <BillingTable /> : <EmptyState onNavigate={onNavigate} />}
        </div>
    );
};

export default DashboardBilling;