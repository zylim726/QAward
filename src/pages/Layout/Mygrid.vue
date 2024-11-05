<template>
    <div class="container-fluid">
        <!-- FlexGrid with filtering and column pinning -->
        <wj-flex-grid 
            :autoRowHeights="true" 
            :autoGenerateColumns="false" 
            :itemsSource="Description" 
            :initialized="initializedGrid" 
            :frozenColumns="6" 
            :stickyHeaders=true
            allowPinning="SingleColumn"  
        >
            <wj-flex-grid-filter />

            <!-- Define grid columns -->
            <wj-flex-grid-column-group :binding="'itemIndex'" :header="'Item'" :wordWrap="true" :width="220" :isReadOnly="true"></wj-flex-grid-column-group>
            <wj-flex-grid-column-group :binding="'element'" :header="'Element'" :minWidth="100" :wordWrap="true" :isReadOnly="true"></wj-flex-grid-column-group>
            <wj-flex-grid-column-group :binding="'sub_element'" :header="'Sub Element'" :wordWrap="true" :isReadOnly="true"></wj-flex-grid-column-group>
            <wj-flex-grid-column-group :binding="'description_sub_sub_element'" :header="'Sub Sub Element'" :wordWrap="true" :isReadOnly="true"></wj-flex-grid-column-group>
            <wj-flex-grid-column-group :binding="'description_item'" :header="'Description'" :minWidth="400" :width="'*'" :wordWrap="true" :isReadOnly="true"></wj-flex-grid-column-group>
            
         
            <wj-flex-grid-column-group 
                v-for="(unit, index) in UnitType" 
                :key="unit.type" 
                :binding="`typeQty[` + index + `]`"
                :header="`${unit.type} (${unit.quantity})`"  align="right" :wordWrap="true"  :isReadOnly="true"> 
            </wj-flex-grid-column-group>

            <wj-flex-grid-column-group :binding="'description_unit'" :header="'Unit'" :width="65" :wordWrap="true" :isReadOnly="true"></wj-flex-grid-column-group>
            <wj-flex-grid-column-group :binding="'bqQty'"  :header="'BQ Qty'" :wordWrap="true" :isReadOnly="true"></wj-flex-grid-column-group>
            <wj-flex-grid-column-group :binding="'adjQty'" :header="'ADJ Qty'" :wordWrap="true" :isReadOnly="true"></wj-flex-grid-column-group>
            <wj-flex-grid-column-group :binding="'remeasureQty'" :header="'Reameasurement Qty'" :width="150" :wordWrap="true" :isReadOnly="true"></wj-flex-grid-column-group>
            
            <wj-flex-grid-column-group 
                v-for="(subconList, index) in SubconList" 
                :key="index" 
                :header="GetDisplayName(index)" :wordWrap="true"  align="center">
                <wj-flex-grid-column-group  :binding="`quotes[` + index + `].rate`"   align="right" header="Rate" :wordWrap="true"  :isReadOnly="true"></wj-flex-grid-column-group>
                <wj-flex-grid-column-group   :binding="`quotes[` + index + `].adjAmt`"  align="right" header="Amount"  :wordWrap="true"   :isReadOnly="true"></wj-flex-grid-column-group>
            </wj-flex-grid-column-group>

            
        </wj-flex-grid>

        <!-- Column Picker (Hidden initially) -->
        <div style="display:none">
            <wj-list-box class="column-picker" :initialized="initializedPicker"></wj-list-box>
        </div>
    </div>
</template>

<script>
import "@mescius/wijmo.styles/wijmo.css";
import { showPopup, hidePopup, hasClass } from "@mescius/wijmo"; 
import DescriptionController from "@/services/controllers/DescriptionController.js";

export default {
    name: "app",
    data() {
        return {
            Description: [],
            UnitType: [],
            SubconList: [],
            columnPicker: null,
            flex: null, // Reference to the grid instance
        };
    },
    mounted() {
        this.getFullDetails(); // Fetch data

        // Initialize the column picker
        if (this.columnPicker) {
            this.columnPicker.itemsSource = this.flex.columns;
            this.columnPicker.checkedMemberPath = 'visible';
            this.columnPicker.displayMemberPath = 'header';
            this.columnPicker.lostFocus.addHandler(() => {
                hidePopup(this.columnPicker.hostElement);
            });
        }
    },
    methods: {
        GetDisplayName(index) {
            const subcon = this.SubconList[index];
            let getDisplay = '';

            if (index === 0 && subcon.Subcon.name === 'Budget') {
                getDisplay = 'Budget Cost';
            } else if (index === 1 && subcon.Subcon.name === 'Budget') {
                getDisplay = 'Budget Adj';
            } else if (index === 2 && subcon.Subcon.name === 'Budget') {
                getDisplay = 'Budget Remeasurement';
            } else if (this.SubconList.length >= 2) {
                // Display both subcon.Subcon.name and subcon.name
                getDisplay = subcon.name ? `${subcon.Subcon.name} (${subcon.name})` : subcon.Subcon.name;
            }
            
            return getDisplay;
        },
        async getFullDetails() {
            try {
                const id = this.$route.query.cqId;
                const data = await DescriptionController.getFullDetails(id);
                this.Description = data.descriptions;
                this.UnitType = data.types;
                this.SubconList = data.conlists;

                console.log('get response',data);

                const totalRows = [
                    { itemIndex: 'BQ Total Amount (RM)', quotes: [] },
                    { itemIndex: 'ADJ Total Amount (RM)', quotes: [] },
                    { itemIndex: 'Remeasurement Total Amount (RM)', quotes: [] },
                    { itemIndex: 'Discount Given (RM)', quotes: [] },
                    { itemIndex: 'After Discount Given (RM)', quotes: [] },
                    { itemIndex: 'Total Saving / Overrun (RM)', quotes: [] },
                    { itemIndex: 'Total Saving / Overrun (%)', quotes: [] },
                    { itemIndex: 'Ranking', quotes: [] },
                    { itemIndex: 'Contingency Sum (RM)', quotes: [] },
                ];
                
                // Loop through totalRows and populate quotes
                totalRows.forEach((totalRow, totalRowIndex) => {
                data.conlists.forEach((item, index) => {
                 
                    let smyValue;

                    // Check for specific conditions and assign smyValue
                    if (index === 1 && item.Subcon && item.Subcon.name === 'Budget') {
                    switch (totalRow.element) {
                        case 'ADJ Total Amount (RM)':
                        smyValue = item.adjTotal;
                        break;
                        default:
                        smyValue = ''; 
                    }
                    } else if (index === 0 && item.Subcon && item.Subcon.name === 'Budget') {
                    switch (totalRow.element) {
                        case 'BQ Total Amount (RM)':
                        smyValue = item.bqTotal;
                        break;
                        default:
                        smyValue = ''; 
                    }
                    } else if (index === 2 && item.Subcon && item.Subcon.name === 'Budget') {
                    switch (totalRow.element) {
                        case 'Remeasurement Total Amount (RM)':
                        smyValue = item.remeasureTotal;
                        break;
                        default:
                        smyValue = ''; 
                    }
                    } else {
                    switch (totalRow.element) {
                        case 'BQ Total Amount (RM)':
                        smyValue = item.bqTotal;
                        break;
                        case 'ADJ Total Amount (RM)':
                        smyValue = item.adjTotal; 
                        break;
                        case 'Remeasurement Total Amount (RM)':
                        smyValue = item.remeasureTotal;
                        break;
                        case 'Discount Given (RM)':
                        smyValue = item.discount;
                        break;
                        case 'After Discount Given (RM)':
                        smyValue = item.adjAfterDiscount; 
                        break;
                        case 'Total Saving / Overrun (RM)':
                        smyValue = item.adjSaving; 
                        break;
                        case 'Total Saving / Overrun (%)':
                        smyValue = item.saveRate; 
                        break;
                        case 'Ranking':
                        smyValue = item.ranking; 
                        break;
                        case 'Contingency Sum (RM)':
                        smyValue = item.contingencySum;
                        break;
                        default:
                        smyValue = ''; 
                    }
                    }
                    });
                });
                });

                // Push the processed totalRows to Description and log the result
                this.Description.push(...totalRows);
    


                if (this.flex) {
                    this.flex.select(-1, -1); // Clear any existing selection
                }
             
            } catch (error) {
                this.error = `Error Message: ${error.message || 'Unknown error'}`;
            } 
        },
        initializedPicker(picker) {
            this.columnPicker = picker; 
        },
        initializedGrid(ctl) {
            this.flex = ctl; 

            this.flex.frozenColumns = 6;

            this.flex.formatItem.addHandler((s, e) => {
                // Check if the current row is one of the additional rows
                const lastRowCount = 9; 
                const lastRowIndex = s.rows.length - lastRowCount;

                if (e.col >= 0 && e.col < s.columns.length) {
                    // Get the header name for the current column
                    const headerName = s.columns[e.col].header;
                   
                    // Define border and background styling
                    const isAdditionalRow = e.row >= lastRowIndex;
                    const isAmountColumn = headerName === 'Amount';
                    const isUnitColumn = headerName === 'Reameasurement Qty';
                   
               
                    if (isAmountColumn || isUnitColumn) {
                        if (isAdditionalRow) {
                            const rowIndexInLastRows = e.row - lastRowIndex;  // Calculate index within the last rows (0 to 8)
                            if (rowIndexInLastRows === 0) {
                                e.cell.style.borderTop = '0.5px solid darkgrey'; // First additional row
                            } else {
                                e.cell.style.borderTop = 'none';
                            }
                            e.cell.style.backgroundColor = '#faebd7';
                            e.cell.style.borderLeft = 'none';
                            e.cell.style.borderRight = '0.5px solid darkgrey'; 
                            e.cell.style.borderBottom = 'none';
                        } else {
                            const rowIndexInLastRows = e.row - lastRowIndex;  // Calculate index within the last rows (0 to 8)
                            // Reset styles for non-additional rows
                            e.cell.style.backgroundColor = '';
                            e.cell.style.borderLeft = '';
                            e.cell.style.borderRight = '';
                            e.cell.style.borderBottom = '';
                            if (rowIndexInLastRows === 0) {
                                e.cell.style.borderTop = '0.5px solid darkgrey'; // First additional row
                            } else {
                                e.cell.style.borderTop = 'none';
                            }
                        }
                    } else {
                        // If not the "Amount" column, handle additional row styling
                        if (isAdditionalRow) {
                            e.cell.style.backgroundColor = '#faebd7';
                            e.cell.style.borderLeft = 'none';
                            e.cell.style.borderRight = 'none';
                            e.cell.style.borderBottom = 'none';
                            const rowIndexInLastRows = e.row - lastRowIndex;  // Calculate index within the last rows (0 to 8)
                            if (rowIndexInLastRows === 0) {
                                e.cell.style.borderTop = '0.5px solid darkgrey'; // First additional row
                            } else {
                                e.cell.style.borderTop = 'none';
                            }
                        } else {
                            // Reset styles for non-additional rows
                            e.cell.style.backgroundColor = '';
                            e.cell.style.borderLeft = '';
                            e.cell.style.borderRight = '';
                            e.cell.style.borderBottom = '';
                            const rowIndexInLastRows = e.row - lastRowIndex;  // Calculate index within the last rows (0 to 8)
                            if (rowIndexInLastRows === 0) {
                                e.cell.style.borderTop = '0.5px solid darkgrey'; // First additional row
                            } else {
                                e.cell.style.borderTop = 'none';
                            }
                        }
                    }
                } else {
                    // Handle out of range column index case
                    if (e.row >= lastRowIndex) {
                        e.cell.style.backgroundColor = '#faebd7'; 
                        e.cell.style.borderLeft = 'none'; 
                        e.cell.style.borderRight = 'none'; 
                        e.cell.style.borderBottom = 'none'; 
                        const rowIndexInLastRows = e.row - lastRowIndex;  // Calculate index within the last rows (0 to 8)
                        if (rowIndexInLastRows === 0) {
                            e.cell.style.borderTop = '0.5px solid darkgrey'; // First additional row
                        } else {
                            e.cell.style.borderTop = 'none';
                        }
                    } else {
                        // Reset styles for non-additional rows
                        e.cell.style.backgroundColor = ''; 
                        e.cell.style.borderLeft = ''; 
                        e.cell.style.borderRight = ''; 
                        e.cell.style.borderBottom = ''; 
                        const rowIndexInLastRows = e.row - lastRowIndex;  // Calculate index within the last rows (0 to 8)
                        if (rowIndexInLastRows === 0) {
                            e.cell.style.borderTop = '0.5px solid darkgrey'; // First additional row
                        } else {
                            e.cell.style.borderTop = 'none';
                        }
                    }
                }

             
                if (e.panel === s.topLeftCells) {
                    if (e.row === 0) { // Remember, the row index is 0-based
                        e.cell.innerHTML = '<span class="column-picker-icon">⚙️</span>'; // Show the gear icon
                    } else {
                        e.cell.innerHTML = '<span class="column-picker-icon"></span>'; 
                    }
                }
            });

            // Show the column picker on clicking the top-left cell
            let ref = this.flex.hostElement.querySelector(".wj-topleft");
            ref.addEventListener("mousedown", (e) => {
                if (hasClass(e.target, "column-picker-icon")) {
                    let host = this.columnPicker.hostElement;
                    if (!host.offsetHeight) {
                        showPopup(host, ref, false, true, false);
                        this.columnPicker.focus();
                    } else {
                        hidePopup(host, true, true);
                        this.flex.focus();
                    }
                }
            });
            
        },
    },
};
</script>



<style>
.container-fluid .wj-flexgrid {
    margin: 10px 0;
    width: 100%;
}

.container-fluid {
    font-size: 12px; 
}

.wj-listbox.column-picker {
    padding: 12px;
    margin-left: 12px;
    margin-top: 26px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

.wj-listbox .wj-listbox-item:hover {
    background: rgba(0, 0, 0, .05);
}

.wj-flexgrid .wj-state-sticky .wj-header {
    opacity: 1 !important;
}

.wj-listbox .drop-marker {
    position: absolute;
    background: orange;
    opacity: 0.5;
    pointer-events: none;
    z-index: 1000;
}

.wj-flexgrid .wj-cell.wj-frozen:not(.wj-header):not(.wj-group):not(.wj-state-selected):not(.wj-state-multi-selected),
.wj-flexgrid .wj-cell.wj-frozen.wj-alt:not(.wj-header):not(.wj-group):not(.wj-state-selected):not(.wj-state-multi-selected) {
    background: #faebd7;
}

.wj-cells .wj-cell.wj-state-selected {
    background: transparent !important;
    color: inherit !important;
}
</style>

