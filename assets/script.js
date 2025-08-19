document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('checkbox');
    const toggleBtn = document.getElementById('toggleBtn');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    // Handle toggle change
    checkbox.addEventListener('change', function () {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            if (checkbox.checked) {
                sidebar.classList.add('active');
            } else {
                sidebar.classList.remove('active');
            }
            // Prevent desktop collapse styles from conflicting
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        } else {
            if (checkbox.checked) {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            } else {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('expanded');
            }
            // Prevent mobile styles from conflicting
            sidebar.classList.remove('active');
        }
    });

    // Auto-reset on window resize
    window.addEventListener('resize', function () {
        checkbox.checked = false;
        sidebar.classList.remove('active');
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    });

    // Optional: close sidebar on outside click (mobile only)
    document.addEventListener('click', function (e) {
        const isMobile = window.innerWidth <= 768;
        if (
            isMobile &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !toggleBtn.contains(e.target)
        ) {
            checkbox.checked = false;
            sidebar.classList.remove('active');
        }
    });

    // Submenu toggle logic
    document.querySelectorAll('.submenu-toggle').forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            const submenu = this.nextElementSibling;

            // Optional: close other open submenus
            document.querySelectorAll('.submenu').forEach(menu => {
                if (menu !== submenu) {
                    menu.classList.remove('open');
                    const otherArrow = menu.previousElementSibling?.querySelector('.arrow');
                    if (otherArrow) otherArrow.classList.remove('rotated');
                }
            });



            submenu.classList.toggle('open');

            // Arrow rotation
            const arrow = this.querySelector('.arrow');
            if (arrow) arrow.classList.toggle('rotated');
        });
    });

    // --- Customer Form Logic ---
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // Collect form data
            const customer = {
                name: document.getElementById('customerName')?.value || '',
                contactPerson: document.getElementById('contactPerson')?.value || '',
                gstNumber: document.getElementById('gstNumber')?.value || '',
                mobileNumber: document.getElementById('mobileNumber')?.value || '',
                alternateNumber: document.getElementById('alternateNumber')?.value || '',
                location: document.getElementById('location')?.value || '',
                address1: document.getElementById('address1')?.value || '',
                address2: document.getElementById('address2')?.value || '',
                city: document.getElementById('city')?.value || '',
                state: document.getElementById('state')?.value || '',
                pinCode: document.getElementById('pinCode')?.value || ''
            };
            // Save to localStorage
            let customers = JSON.parse(localStorage.getItem('customers') || '[]');
            customers.push(customer);
            localStorage.setItem('customers', JSON.stringify(customers));
            // Optionally clear form
            Object.keys(customer).forEach(key => {
                const input = document.getElementById(key);
                if (input) input.value = '';
            });
            // Redirect to customer list page
            window.location.href = './customer-list.html';
        });
    }

    // --- Customer List Logic ---
    const customerTableBody = document.querySelector('#DataTable tbody');
    if (customerTableBody) {
        let customers = JSON.parse(localStorage.getItem('customers') || '[]');
        customerTableBody.innerHTML = '';
        customers.forEach((customer, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${idx + 1}</td>
                <td>${customer.name}</td>
                <td>${customer.mobileNumber}</td>
                <td>${customer.location}</td>
                <td>${customer.city}</td>
                <td>
                    <button class="btn btn-sm btn-info" title="edit"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" title="Delete" onclick="deleteCustomer(${idx})"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            customerTableBody.appendChild(tr);
        });
    }
    // Delete customer function (global for inline onclick)
    window.deleteCustomer = function (idx) {
        let customers = JSON.parse(localStorage.getItem('customers') || '[]');
        customers.splice(idx, 1);
        localStorage.setItem('customers', JSON.stringify(customers));
        location.reload();
    };
});



