import React from 'react';
import { PatientSidebar } from './sidebar';
import './PatientLabResult.css';
import ChatbotLauncher from './chatbotLauncher.tsx';

const PatientLabResults: React.FC = () => {
    return (
        <div className="lab-results-page">
            <PatientSidebar />

            <div className="lab-content">
                {/* Left/Main Column */}
                <div className="left-col">
                    {/* Summary Cards */}
                    <div className="summary-cards">
                        <div className="card">
                            <div className="icon"><i className="fas fa-calendar-check"></i></div>
                            <h3>Last Test</h3>
                            <p>Mar 20, 2025</p>
                        </div>
                        <div className="card">
                            <div className="icon"><i className="fas fa-vials"></i></div>
                            <h3>Total Tests</h3>
                            <p>25</p>
                        </div>
                        <div className="card">
                            <div className="icon"><i className="fas fa-exclamation-triangle"></i></div>
                            <h3>Abnormal</h3>
                            <p>3</p>
                        </div>
                        <div className="card">
                            <div className="icon"><i className="fas fa-check-circle"></i></div>
                            <h3>Normal %</h3>
                            <p>88%</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="filters">
                        <input type="date" aria-label="From date" />
                        <input type="date" aria-label="To date" />
                        <input type="search" placeholder="Filter by test name…" />
                    </div>

                    {/* Abnormal Alert */}
                    <div className="alert">
                        <i className="fas fa-exclamation-circle"></i>
                        Your Vitamin D level is low — consider supplementation.
                    </div>

                    {/* Lab Results Table */}
                    <table className="lab-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Test</th>
                                <th>Result</th>
                                <th>Units</th>
                                <th>Ref Range</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2025-03-20</td>
                                <td>Cholesterol</td>
                                <td>190</td>
                                <td>mg/dL</td>
                                <td>125-200</td>
                                <td className="status-borderline">Borderline</td>
                            </tr>
                            <tr>
                                <td>2025-03-20</td>
                                <td>Vitamin D</td>
                                <td>18</td>
                                <td>ng/mL</td>
                                <td>30-100</td>
                                <td className="status-critical">Low</td>
                            </tr>
                            <tr>
                                <td>2025-03-20</td>
                                <td>HbA1c</td>
                                <td>5.6</td>
                                <td>%</td>
                                <td>4.0-5.6</td>
                                <td className="status-normal">Normal</td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                {/* Right Sidebar Column */}
                <aside className="right-col">
                    <div className="widget">
                        <h3>Quick Actions</h3>
                        <ul>
                            <li><i className="fas fa-file-download"></i> Download PDF</li>
                            <li><i className="fas fa-envelope"></i> Email Report</li>
                            <li><i className="fas fa-calendar-plus"></i> Schedule Follow-up</li>
                        </ul>
                    </div>

                    <div className="widget">
                        <h3>Next Appointment</h3>
                        <ul>
                            <li>Mar 25, 2025 • 10:00 AM</li>
                            <li>Dr. Smith (Check-up)</li>
                        </ul>
                    </div>

                    <div className="widget">
                        <h3>Health Tips</h3>
                        <ul>
                            <li>Increase vitamin D intake</li>
                            <li>Maintain balanced diet</li>
                            <li>Stay active daily</li>
                        </ul>
                    </div>
                </aside>
            </div>
            <ChatbotLauncher />
        </div>
    );
};

export default PatientLabResults;
