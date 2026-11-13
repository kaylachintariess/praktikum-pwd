
        /* ==========================================================================
           KETENTUAN 1: Data Produk dalam Array of Object & DOM Manipulation Murni
           (createElement, createTextNode, appendChild)
           ========================================================================== */
        
        // Minimal 6 produk disimpan dalam array of object dengan atribut id, nama, harga, dan stok
        const daftarProdukData = [
            { id: 1, nama: "Laptop Ultrabook Pro 14", harga: 12500000, stok: 4, ikon: "💻" },
            { id: 2, nama: "Smartphone Flagship 5G", harga: 8900000, stok: 6, ikon: "📱" },
            { id: 3, nama: "Headphone Wireless ANC", harga: 1750000, stok: 5, ikon: "🎧" },
            { id: 4, nama: "Smartwatch Sport GPS", harga: 2300000, stok: 3, ikon: "⌚" },
            { id: 5, nama: "Keyboard Mechanical RGB", harga: 950000, stok: 7, ikon: "⌨️" },
            { id: 6, nama: "Mouse Gaming Wireless", harga: 650000, stok: 8, ikon: "🖱️" },
            { id: 7, nama: "Monitor IPS 27 Inch 144Hz", harga: 3400000, stok: 2, ikon: "🖥️" },
            { id: 8, nama: "Tablet Desain Stylus", harga: 6200000, stok: 4, ikon: "📟" }
        ];

        // Fungsi helper untuk memformat angka ke mata uang Rupiah
        function formatRupiah(angka) {
            return "Rp " + angka.toLocaleString("id-ID");
        }

        // Menampilkan produk ke halaman menggunakan perulangan + createElement(), createTextNode(), appendChild()
        function renderDaftarProduk() {
            const wadahProduk = document.getElementById("daftarProduk");
            wadahProduk.innerHTML = ""; // Bersihkan kontainer sebelum render ulang

            for (let i = 0; i < daftarProdukData.length; i++) {
                const produk = daftarProdukData[i];

                // 1. Membuat elemen kartu produk (<div class="product-card">)
                const card = document.createElement("div");
                card.className = "product-card";
                card.setAttribute("data-id", produk.id);

                // Bagian atas kartu (ikon, nama, harga, stok)
                const infoWrapper = document.createElement("div");

                // 2. Membuat kotak ikon produk
                const iconBox = document.createElement("div");
                iconBox.className = "product-icon";
                const iconText = document.createTextNode(produk.ikon);
                iconBox.appendChild(iconText);

                // 3. Membuat judul produk (<h3>)
                const titleEl = document.createElement("h3");
                titleEl.className = "product-title";
                const titleText = document.createTextNode(produk.nama);
                titleEl.appendChild(titleText);

                // 4. Membuat harga produk (<p>)
                const priceEl = document.createElement("p");
                priceEl.className = "product-price";
                const priceText = document.createTextNode(formatRupiah(produk.harga));
                priceEl.appendChild(priceText);

                // 5. Membuat info stok produk (<span>)
                const stockEl = document.createElement("span");
                stockEl.className = produk.stok > 0 ? "product-stock" : "product-stock habis";
                stockEl.id = "stok-produk-" + produk.id;
                const stockLabel = produk.stok > 0 ? "Stok tersedia: " + produk.stok : "Stok Habis (0)";
                const stockText = document.createTextNode(stockLabel);
                stockEl.appendChild(stockText);

                // Gabungkan ke dalam infoWrapper menggunakan appendChild()
                infoWrapper.appendChild(iconBox);
                infoWrapper.appendChild(titleEl);
                infoWrapper.appendChild(priceEl);
                infoWrapper.appendChild(stockEl);

                // 6. Membuat tombol "Tambah ke Keranjang" (<button>)
                const btnAdd = document.createElement("button");
                btnAdd.type = "button";
                btnAdd.className = produk.stok > 0 ? "btn-add-cart" : "btn-add-cart out-of-stock";
                btnAdd.id = "btn-beli-" + produk.id;
                btnAdd.setAttribute("data-id", produk.id);
                const btnText = document.createTextNode("Tambah ke Keranjang");
                btnAdd.appendChild(btnText);

                // Gabungkan infoWrapper dan tombol ke dalam card, lalu ke wadahProduk
                card.appendChild(infoWrapper);
                card.appendChild(btnAdd);
                wadahProduk.appendChild(card);
            }
        }

        // Fungsi memperbarui tampilan stok di kartu produk secara spesifik
        function perbaruiTampilanStok(produk) {
            const stockEl = document.getElementById("stok-produk-" + produk.id);
            const btnEl = document.getElementById("btn-beli-" + produk.id);

            if (stockEl && btnEl) {
                // Hapus teks lama dan buat textNode baru
                stockEl.innerHTML = "";
                const teksBaru = produk.stok > 0 ? "Stok tersedia: " + produk.stok : "Stok Habis (0)";
                stockEl.appendChild(document.createTextNode(teksBaru));

                if (produk.stok > 0) {
                    stockEl.className = "product-stock";
                    btnEl.className = "btn-add-cart";
                } else {
                    stockEl.className = "product-stock habis";
                    btnEl.className = "btn-add-cart out-of-stock";
                }
            }
        }

        // Panggil fungsi render awal saat halaman dimuat
        renderDaftarProduk();


        /* ==========================================================================
           KETENTUAN 6: Gunakan $(document).ready() pada semua kode jQuery
           ========================================================================== */
        $(document).ready(function () {
            // Array untuk menyimpan data item yang sedang berada di keranjang
            let keranjang = [];

            // Fungsi untuk memperbarui jumlah item dan total harga menggunakan jQuery .text()
            function perbaruiRingkasanKeranjang() {
                const totalItem = keranjang.length;
                let totalBiaya = 0;

                for (let i = 0; i < keranjang.length; i++) {
                    totalBiaya += keranjang[i].harga;
                }

                // KETENTUAN 2: text() untuk menampilkan jumlah item dan total harga
                $("#jumlahItem").text(totalItem);
                $("#headerJumlahItem").text(totalItem);
                $("#totalHarga").text(formatRupiah(totalBiaya));

                // Tampilkan atau sembunyikan pesan keranjang kosong
                if (totalItem === 0) {
                    $("#pesanKosong").show();
                } else {
                    $("#pesanKosong").hide();
                }
            }

            /* ----------------------------------------------------------------------
               KETENTUAN 2 & 3 & 4: Tambah ke Keranjang + append() + fadeIn() + alert()
               ---------------------------------------------------------------------- */
            $("#daftarProduk").on("click", ".btn-add-cart", function () {
                const idProduk = parseInt($(this).attr("data-id"));
                const produk = daftarProdukData.find(item => item.id === idProduk);

                if (!produk) return;

                // KETENTUAN 4: alert() jika stok produk habis
                if (produk.stok <= 0) {
                    alert("Maaf, stok produk '" + produk.nama + "' sudah habis!");
                    return;
                }

                // Kurangi stok produk dan perbarui tampilan stok di kartu produk
                produk.stok -= 1;
                perbaruiTampilanStok(produk);

                // Buat ID unik untuk baris item di keranjang
                const uidItem = Date.now() + "-" + Math.floor(Math.random() * 1000);
                keranjang.push({
                    uid: uidItem,
                    id: produk.id,
                    nama: produk.nama,
                    harga: produk.harga
                });

                // Buat elemen <li> item keranjang (disembunyikan dulu untuk efek fadeIn)
                const $itemBaru = $(`
                    <li class="cart-item" data-uid="${uidItem}" data-id="${produk.id}" style="display: none;">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${produk.ikon} ${produk.nama}</div>
                            <div class="cart-item-price">${formatRupiah(produk.harga)}</div>
                        </div>
                        <button type="button" class="btn-remove-item" title="Hapus item">Hapus</button>
                    </li>
                `);

                // KETENTUAN 2: append() untuk menambah item ke keranjang
                $("#daftarKeranjang").append($itemBaru);

                // KETENTUAN 3: fadeIn() saat item masuk ke keranjang
                $itemBaru.fadeIn(300);

                // Pastikan panel keranjang terlihat jika sebelumnya ditutup
                if ($("#panelKeranjang").is(":hidden")) {
                    $("#panelKeranjang").fadeIn(250);
                }

                perbaruiRingkasanKeranjang();
            });

            /* ----------------------------------------------------------------------
               KETENTUAN 2 & 3 & 4: Hapus Satu Item + confirm() + fadeOut() + remove()
               ---------------------------------------------------------------------- */
            $("#daftarKeranjang").on("click", ".btn-remove-item", function () {
                const $barisItem = $(this).closest(".cart-item");
                const uidItem = $barisItem.attr("data-uid");
                const idProduk = parseInt($barisItem.attr("data-id"));
                const namaProduk = $barisItem.find(".cart-item-name").text().trim();

                // KETENTUAN 4: confirm() sebelum menghapus satu item
                const konfirmasiHapus = confirm("Apakah Anda yakin ingin menghapus '" + namaProduk + "' dari keranjang?");
                if (!konfirmasiHapus) {
                    return;
                }

                // Kembalikan stok produk
                const produk = daftarProdukData.find(item => item.id === idProduk);
                if (produk) {
                    produk.stok += 1;
                    perbaruiTampilanStok(produk);
                }

                // Hapus dari array keranjang
                keranjang = keranjang.filter(item => item.uid !== uidItem);

                // KETENTUAN 3 & 2: fadeOut() saat item dihapus, lalu remove() di dalam callback
                $barisItem.fadeOut(300, function () {
                    $(this).remove();
                    perbaruiRingkasanKeranjang();
                });
            });

            /* ----------------------------------------------------------------------
               KETENTUAN 2 & 4: Kosongkan Keranjang + confirm() + empty()
               ---------------------------------------------------------------------- */
            $("#btnKosongkan").on("click", function () {
                if (keranjang.length === 0) {
                    alert("Keranjang belanja sudah kosong!");
                    return;
                }

                // KETENTUAN 4: confirm() sebelum mengosongkan keranjang
                const konfirmasiKosongkan = confirm("Apakah Anda yakin ingin mengosongkan seluruh isi keranjang belanja?");
                if (!konfirmasiKosongkan) {
                    return;
                }

                // Kembalikan semua stok produk yang ada di keranjang
                for (let i = 0; i < keranjang.length; i++) {
                    const produk = daftarProdukData.find(item => item.id === keranjang[i].id);
                    if (produk) {
                        produk.stok += 1;
                        perbaruiTampilanStok(produk);
                    }
                }

                // Reset array keranjang
                keranjang = [];

                // KETENTUAN 2: empty() untuk tombol "Kosongkan Keranjang"
                $("#daftarKeranjang").empty();
                perbaruiRingkasanKeranjang();
            });

            /* ----------------------------------------------------------------------
               KETENTUAN 3: fadeToggle() pada panel keranjang yang dapat dibuka & ditutup
               ---------------------------------------------------------------------- */
            $("#btnToggleKeranjang").on("click", function () {
                $("#panelKeranjang").fadeToggle(300);
            });

            /* ----------------------------------------------------------------------
               KETENTUAN 4: Checkout dengan prompt() dan menampilkan ringkasan pesanan
               ---------------------------------------------------------------------- */
            $("#btnCheckout").on("click", function () {
                if (keranjang.length === 0) {
                    alert("Keranjang masih kosong. Silakan tambahkan produk terlebih dahulu sebelum checkout!");
                    return;
                }

                // KETENTUAN 4: prompt() saat checkout untuk meminta nama pembeli
                const namaPembeli = prompt("Masukkan nama lengkap pembeli untuk menyelesaikan pesanan:");

                // Validasi jika user menekan Batal atau mengosongkan nama
                if (namaPembeli === null || namaPembeli.trim() === "") {
                    alert("Checkout dibatalkan. Nama pembeli wajib diisi.");
                    return;
                }

                // Kelompokkan item yang sama agar ringkasan pesanan lebih rapi
                const ringkasanItemMap = {};
                let totalAkhir = 0;

                keranjang.forEach(function (item) {
                    totalAkhir += item.harga;
                    if (!ringkasanItemMap[item.id]) {
                        ringkasanItemMap[item.id] = {
                            nama: item.nama,
                            harga: item.harga,
                            qty: 1
                        };
                    } else {
                        ringkasanItemMap[item.id].qty += 1;
                    }
                });

                // Isi data ke area Ringkasan Pesanan di halaman
                $("#strukNamaPembeli").text(namaPembeli.trim());
                $("#strukWaktu").text(new Date().toLocaleString("id-ID"));
                $("#strukDaftarItem").empty();

                Object.values(ringkasanItemMap).forEach(function (item) {
                    const subtotal = item.harga * item.qty;
                    $("#strukDaftarItem").append(`
                        <li>
                            <span>${item.nama} (x${item.qty})</span>
                            <strong>${formatRupiah(subtotal)}</strong>
                        </li>
                    `);
                });

                $("#strukTotalHarga").text(formatRupiah(totalAkhir));

                // Tampilkan ringkasan pesanan dengan efek fadeIn
                $("#ringkasanPesanan").hide().fadeIn(400);

                // Bersihkan keranjang setelah checkout berhasil (stok tetap berkurang karena sudah dibeli)
                keranjang = [];
                $("#daftarKeranjang").empty();
                perbaruiRingkasanKeranjang();
            });

            /* ----------------------------------------------------------------------
               KETENTUAN 5: Fitur pencarian produk dengan val() dan toggle()
               ---------------------------------------------------------------------- */
            $("#inputPencarian").on("keyup input", function () {
                // Ambil kata kunci menggunakan .val()
                const kataKunci = $(this).val().toLowerCase().trim();

                // Loop setiap kartu produk dan gunakan .toggle() berdasarkan kecocokan
                $("#daftarProduk .product-card").each(function () {
                    const namaProduk = $(this).find(".product-title").text().toLowerCase();
                    const cocok = namaProduk.indexOf(kataKunci) > -1;
                    $(this).toggle(cocok);
                });
            });
        });
    